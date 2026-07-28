import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import type { AccountTier } from '@/types/database'

function verifyAdmin(request: NextRequest): boolean {
  const key = request.headers.get('x-admin-key')
  return key === process.env.ADMIN_SECRET_KEY
}

export async function POST(request: NextRequest) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: 'Ruhusa imekataliwa' }, { status: 401 })
  }

  try {
    const { landlordId, tier } = await request.json() as {
      landlordId: string
      tier: AccountTier
    }

    if (!landlordId || !['leniency', 'premium'].includes(tier)) {
      return NextResponse.json({ error: 'Thamani batili' }, { status: 400 })
    }

    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from('landlords')
      .update({ account_tier: tier })
      .eq('id', landlordId)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({
      success: true,
      message: `Daraja limewekwa: ${tier}`,
      landlord: data,
    })
  } catch (error) {
    console.error('set-tier error:', error)
    return NextResponse.json({ error: 'Hitilafu ya seva' }, { status: 500 })
  }
}
