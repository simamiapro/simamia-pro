import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { TopUpClient } from './_components/topup-client'
import type { Landlord } from '@/types/database'

export const metadata = { title: 'Ongeza Salio' }

export default async function TopUpPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: landlord } = await supabase
    .from('landlords')
    .select('*')
    .eq('id', user.id)
    .single()

  return <TopUpClient landlord={landlord as Landlord} />
}
