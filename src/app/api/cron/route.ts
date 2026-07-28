import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { sendSms } from '@/lib/beem'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

/**
 * Daily cron job — runs at 05:00 UTC (08:00 EAT)
 * Handles:
 * 1. Contract End Reminders (7, 3, and 0 days before lease_end_date)
 * 2. Past Debt Reminders (Every 28 days from contract_start_date if past_debt_amount > 0)
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
  today.setHours(0, 0, 0, 0)
  console.log(`[CRON] Starting reminder job. Date: ${today.toISOString()}`)

  const supabase = createAdminClient()

  try {
    // 1. Fetch eligible landlords
    const { data: landlords } = await supabase
      .from('landlords')
      .select('id, sms_credits')
      .eq('account_tier', 'premium')
      .gt('sms_credits', 0)

    if (!landlords || landlords.length === 0) {
      return NextResponse.json({ success: true, processed: 0, message: 'No eligible landlords' })
    }
    
    const landlordMap = Object.fromEntries(landlords.map((l) => [l.id, l]))
    const eligibleLandlordIds = Object.keys(landlordMap)

    // 2. Fetch all tenants for these landlords
    // Using inner joins to only get tenants belonging to the eligible landlords
    const { data: tenants, error: tenantsError } = await supabase
      .from('tenants')
      .select(`
        id,
        name,
        phone,
        lease_end_date,
        contract_start_date,
        past_debt_amount,
        units!inner (
          monthly_rent,
          properties!inner (
            landlord_id
          )
        )
      `)
      .in('units.properties.landlord_id', eligibleLandlordIds)

    if (tenantsError) throw tenantsError

    if (!tenants || tenants.length === 0) {
      return NextResponse.json({ success: true, processed: 0, message: 'No tenants found' })
    }

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
      const landlordId = tAny.units.properties.landlord_id
      const landlord = landlordMap[landlordId]
      
      if (landlord.sms_credits < 1) {
        skipped++
        continue
      }

      let messageToSend = null

      // Check Past Debt Reminders
      const pastDebt = Number(tenant.past_debt_amount || 0)
      if (pastDebt > 0 && tenant.contract_start_date) {
        const startDate = new Date(tenant.contract_start_date)
        startDate.setHours(0, 0, 0, 0)
        const diffTime = Math.abs(today.getTime() - startDate.getTime())
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

        // Trigger every 28 days
        if (diffDays > 0 && diffDays % 28 === 0) {
          const monthlyRent = Number(tAny.units.monthly_rent || 0)
          const totalOwed = pastDebt + monthlyRent
          messageToSend = `Habari ${tenant.name}, unakumbushwa kulipa deni la nyuma la TZS ${pastDebt.toLocaleString()} na kodi ya mwezi huu TZS ${monthlyRent.toLocaleString()}. Jumla unayodaiwa ni TZS ${totalOwed.toLocaleString()}. — Simamia Pro`
        }
      }

      // Check Contract End Reminders (only if we didn't already schedule a debt reminder today)
      if (!messageToSend && tenant.lease_end_date) {
        const endDate = new Date(tenant.lease_end_date)
        endDate.setHours(0, 0, 0, 0)
        const diffTime = endDate.getTime() - today.getTime()
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

        if (diffDays === 7 || diffDays === 3 || diffDays === 0) {
          let timeContext = diffDays === 0 ? 'leo' : `siku ${diffDays} zijazo`
          messageToSend = `Habari ${tenant.name}, mkataba wako wa kodi unaisha ${timeContext}. Tafadhali wasiliana na mmiliki wako kwa malipo na kufanya upya mkataba. — Simamia Pro`
        }
      }

      if (messageToSend) {
        // Calculate credits
        const messageLength = messageToSend.length
        const creditsNeeded = messageLength > 160 ? 2 : 1

        if (landlord.sms_credits >= creditsNeeded) {
          // Send SMS
          const result = await sendSms(tenant.phone, messageToSend)

          if (result.success) {
            landlord.sms_credits -= creditsNeeded
            sent++
            logs.push({
              landlord_id: landlordId,
              message_type: 'reminder',
              credits_used: creditsNeeded,
              delivery_status: 'sent',
              recipient_phone: tenant.phone,
              message_preview: messageToSend.substring(0, 100)
            })
          } else {
            console.error(`[CRON] Failed to send SMS to ${tenant.phone}:`, result.message)
            skipped++
          }
        } else {
          skipped++
        }
      }
    }

    // Bulk update landlords' credits
    for (const [id, l] of Object.entries(landlordMap) as [string, any][]) {
      const original = landlords.find(orig => orig.id === id)
      if (original && original.sms_credits !== l.sms_credits) {
        await supabase
          .from('landlords')
          .update({ sms_credits: l.sms_credits })
          .eq('id', id)
      }
    }

    // Insert logs
    if (logs.length > 0) {
      await supabase.from('sms_logs').insert(logs)
    }

    return NextResponse.json({
      success: true,
      processed: tenants.length,
      sent,
      skipped
    })
  } catch (error: any) {
    console.error('[CRON] Error executing cron:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
