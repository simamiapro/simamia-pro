import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

function verifyAdmin(request: NextRequest): boolean {
  const key = request.headers.get('x-admin-key')
  return key === process.env.ADMIN_SECRET_KEY
}

export async function POST(request: NextRequest) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: 'Ruhusa imekataliwa' }, { status: 401 })
  }

  try {
    const { landlordId, amount } = await request.json() as {
      landlordId: string
      amount: number
    }

    if (!landlordId || typeof amount !== 'number' || amount <= 0 || amount > 10000) {
      return NextResponse.json({ error: 'Thamani batili. Weka nambari kati ya 1 na 10000.' }, { status: 400 })
    }

    const supabase = createAdminClient()

    // Get current balance first
    const { data: landlord, error: fetchError } = await supabase
      .from('landlords')
      .select('sms_credits')
      .eq('id', landlordId)
      .single()

    if (fetchError || !landlord) {
      return NextResponse.json({ error: 'Mmiliki hapatikani' }, { status: 404 })
    }

    const newCredits = landlord.sms_credits + amount

    const { data, error } = await supabase
      .from('landlords')
      .update({ sms_credits: newCredits })
      .eq('id', landlordId)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({
      success: true,
      message: `Credits ${amount} zimeongezwa. Jumla: ${newCredits}`,
      landlord: data,
    })
  } catch (error) {
    console.error('inject-credits error:', error)
    return NextResponse.json({ error: 'Hitilafu ya seva' }, { status: 500 })
  }
}
