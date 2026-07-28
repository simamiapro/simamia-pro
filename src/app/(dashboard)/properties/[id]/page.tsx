import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { PropertyDetailClient } from './_components/property-detail-client'
import type { Landlord } from '@/types/database'

export const metadata = { title: 'Detail ya Mali' }

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: landlord }, { data: property }] = await Promise.all([
    supabase.from('landlords').select('*').eq('id', user.id).single(),
    supabase
      .from('properties')
      .select(`
        *,
        units (
          *,
          tenants ( id, name, phone, move_in_date, lease_end_date )
        )
      `)
      .eq('id', id)
      .eq('landlord_id', user.id)
      .single(),
  ])

  if (!property) notFound()

  // Count all units across all landlord properties (for tier check)
  const { count: totalUnitCount } = await supabase
    .from('units')
    .select('id', { count: 'exact', head: true })
    .in(
      'property_id',
      (
        await supabase
          .from('properties')
          .select('id')
          .eq('landlord_id', user.id)
      ).data?.map((p) => p.id) ?? []
    )

  return (
    <PropertyDetailClient
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      property={property as any}
      landlord={landlord as Landlord}
      totalUnits={totalUnitCount ?? 0}
    />
  )
}
