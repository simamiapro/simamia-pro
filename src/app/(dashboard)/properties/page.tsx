import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { PropertiesClient } from './_components/properties-client'
import type { Landlord } from '@/types/database'

export const metadata = { title: 'Mali' }

export default async function PropertiesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: landlord }, { data: properties }] = await Promise.all([
    supabase.from('landlords').select('*').eq('id', user.id).single(),
    supabase
      .from('properties')
      .select('*, units(id, custom_name, monthly_rent, status, unit_photo_url)')
      .eq('landlord_id', user.id)
      .order('created_at', { ascending: false }),
  ])

  return (
    <PropertiesClient
      properties={properties ?? []}
      landlord={landlord as Landlord}
    />
  )
}
