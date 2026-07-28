import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendSms } from '@/lib/beem'
import { calculateSmsCost } from '@/lib/utils'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unaohitajika kuingia' }, { status: 401 })
    }

    const { message, recipientIds } = await request.json() as {
      message: string
      recipientIds: string[]
    }

    if (!message?.trim() || !Array.isArray(recipientIds) || recipientIds.length === 0) {
      return NextResponse.json({ error: 'Ujumbe au wapokeaji hawajakamilika' }, { status: 400 })
    }

    if (message.length > 300) {
      return NextResponse.json({ error: 'Ujumbe ni mrefu sana (zaidi ya herufi 300)' }, { status: 400 })
    }

    // Verify landlord has premium tier and enough credits
    const { data: landlord } = await supabase
      .from('landlords')
      .select('*')
      .eq('id', user.id)
      .single()

    if (!landlord) {
      return NextResponse.json({ error: 'Mmiliki hapatikani' }, { status: 403 })
    }

    if (landlord.account_tier !== 'premium') {
      return NextResponse.json({ error: 'Unahitaji akaunti ya Premium kutuma SMS' }, { status: 403 })
    }

    const creditCost = calculateSmsCost(message.length)
    const totalCost = creditCost * recipientIds.length

    if (landlord.sms_credits < totalCost) {
      return NextResponse.json({
        error: `Huna credits za kutosha. Unahitaji ${totalCost}, una ${landlord.sms_credits}`,
      }, { status: 403 })
    }

    // Fetch tenant phone numbers
    const { data: tenants } = await supabase
      .from('tenants')
      .select('id, name, phone')
      .in('id', recipientIds)

    if (!tenants || tenants.length === 0) {
      return NextResponse.json({ error: 'Wapangaji hawapatikani' }, { status: 404 })
    }

    // Send SMS to each recipient
    let sent = 0
    let failed = 0
    const logs: Array<{
      landlord_id: string
      message_type: 'broadcast'
      credits_used: number
      delivery_status: string
      recipient_phone: string
      message_preview: string
    }> = []

    for (const tenant of tenants) {
      const result = await sendSms(tenant.phone, message)
      const status = result.success ? 'sent' : 'failed'

      if (result.success) sent++
      else failed++

      logs.push({
        landlord_id: user.id,
        message_type: 'broadcast',
        credits_used: creditCost,
        delivery_status: status,
        recipient_phone: tenant.phone,
        message_preview: message.slice(0, 100),
      })
    }

    // Deduct credits used for successful sends
    const creditsUsed = creditCost * sent
    if (creditsUsed > 0) {
      await supabase
        .from('landlords')
        .update({ sms_credits: landlord.sms_credits - creditsUsed })
        .eq('id', user.id)
    }

    // Log all transactions
    if (logs.length > 0) {
      await supabase.from('sms_logs').insert(logs)
    }

    return NextResponse.json({
      success: true,
      sent,
      failed,
      creditsUsed,
      message: `SMS imetumwa kwa ${sent} kati ya ${tenants.length} watu`,
    })
  } catch (error) {
    console.error('SMS broadcast error:', error)
    return NextResponse.json({ error: 'Hitilafu ya seva' }, { status: 500 })
  }
}
