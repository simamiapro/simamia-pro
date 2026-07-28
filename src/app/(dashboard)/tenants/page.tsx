import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { TenantsClient } from './_components/tenants-client'
import type { Landlord } from '@/types/database'

export const metadata = { title: 'Wapangaji' }

export default async function TenantsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [
    { data: landlord },
    { data: tenants },
    { data: vacantUnits },
  ] = await Promise.all([
    supabase.from('landlords').select('*').eq('id', user.id).single(),
    supabase
      .from('tenants')
      .select(`
        *,
        units (
          id, custom_name, monthly_rent,
          properties ( id, location, property_type )
        )
      `)
      .order('created_at', { ascending: false }),
    supabase
      .from('units')
      .select('id, custom_name, monthly_rent, property_id, properties!inner(landlord_id, location)')
      .eq('status', 'vacant')
      .eq('properties.landlord_id', user.id),
  ])

  return (
    <TenantsClient
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      tenants={(tenants ?? []) as any[]}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      vacantUnits={(vacantUnits ?? []) as any[]}
      landlord={landlord as Landlord}
    />
  )
}
