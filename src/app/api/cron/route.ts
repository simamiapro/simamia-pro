import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { sendSms } from '@/lib/beem'

/**
 * Daily cron job — runs at 05:00 UTC (08:00 EAT)
 * Sends Swahili rent reminders to tenants whose rent is due in 3 days.
 * Only fires for premium landlords with credits > 0.
 * 
 * Call: GET /api/cron
 * Secured by: Authorization: Bearer <CRON_SECRET>
 */
export async function GET(request: NextRequest) {
  // Verify Vercel cron secret
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const today = new Date()
  const targetDay = today.getDate() + 3 // rent_due_day = today + 3

  console.log(`[CRON] Starting reminder job. Date: ${today.toISOString()}, Target day: ${targetDay}`)

  const supabase = createAdminClient()

  try {
    // Query tenants whose rent_due_day is 3 days from now
    const { data: tenants, error: tenantsError } = await supabase
      .from('tenants')
      .select(`
        id,
        name,
        phone,
        rent_due_day,
        units (
          monthly_rent,
          custom_name,
          properties (
            landlord_id,
            location
          )
        )
      `)
      .eq('rent_due_day', targetDay > 31 ? targetDay - 31 : targetDay) // Handle month boundary

    if (tenantsError) throw tenantsError

    if (!tenants || tenants.length === 0) {
      console.log('[CRON] No tenants with due date in 3 days')
      return NextResponse.json({ success: true, processed: 0, message: 'No reminders due' })
    }

    // Collect landlord IDs to check tier/credits
    const landlordIds = [
      ...new Set(
        tenants
          .map((t) => (t as any)?.units?.properties?.landlord_id)
          .filter(Boolean)
      ),
    ] as string[]

    const { data: landlords } = await supabase
      .from('landlords')
      .select('id, sms_credits, account_tier')
      .in('id', landlordIds)
      .eq('account_tier', 'premium')
      .gt('sms_credits', 0)

    const eligibleLandlordIds = new Set((landlords ?? []).map((l) => l.id))
    const landlordMap = Object.fromEntries((landlords ?? []).map((l) => [l.id, l]))

    let sent = 0
    let skipped = 0
    const logs: Array<{
      landlord_id: string
      message_type: 'reminder'
      credits_used: number
      delivery_status: string
      recipient_phone: string
      message_preview: string
    }> = []

    for (const tenant of tenants) {
      const tAny = tenant as any
      const unit = tAny.units
      const property = unit?.properties
      const landlordId = property?.landlord_id as string

      if (!landlordId || !eligibleLandlordIds.has(landlordId)) {
        skipped++
        continue
      }

      const landlord = landlordMap[landlordId]
      if (landlord.sms_credits < 1) {
        skipped++
        continue
      }

      // Format Swahili reminder message
      const message = `Habari ${tenant.name}, kodi yako ya TZS ${(unit?.monthly_rent ?? 0).toLocaleString()} inaisha tarehe ${tenant.rent_due_day} mwezi huu. Tafadhali lipa mapema. — Simamia Pro`

      const result = await sendSms(tenant.phone, message)
      const status = result.success ? 'sent' : 'failed'

      if (result.success) {
        sent++
        // Deduct 1 credit from landlord
        landlord.sms_credits -= 1
        await supabase
          .from('landlords')
          .update({ sms_credits: landlord.sms_credits })
          .eq('id', landlordId)
      }

      logs.push({
        landlord_id: landlordId,
        message_type: 'reminder',
        credits_used: 1,
        delivery_status: status,
        recipient_phone: tenant.phone,
        message_preview: message.slice(0, 100),
      })
    }

    // Batch log all SMS transactions
    if (logs.length > 0) {
      await supabase.from('sms_logs').insert(logs)
    }

    console.log(`[CRON] Done. Sent: ${sent}, Skipped: ${skipped}`)

    return NextResponse.json({
      success: true,
      processed: tenants.length,
      sent,
      skipped,
      timestamp: today.toISOString(),
    })
  } catch (error) {
    console.error('[CRON] Error:', error)
    return NextResponse.json({ error: 'Cron job failed' }, { status: 500 })
  }
}
