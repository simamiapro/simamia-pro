import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { SmsClient } from './_components/sms-client'
import type { Landlord } from '@/types/database'

export const metadata = { title: 'Tuma SMS' }

export default async function SmsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: landlord }, { data: tenants }] = await Promise.all([
    supabase.from('landlords').select('*').eq('id', user.id).single(),
    supabase
      .from('tenants')
      .select('id, name, phone, units(custom_name, properties(location))')
      .order('name'),
  ])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <SmsClient landlord={landlord as Landlord} tenants={(tenants ?? []) as any[]} />
}
