import { headers } from 'next/headers'
import { createAdminClient } from '@/lib/supabase/server'
import { AdminClient } from './_components/admin-client'
import { AdminKeyForm } from './_components/admin-key-form'

export const metadata = { title: 'Admin Panel' }

export default async function AdminPage() {
  const headersList = await headers()
  const adminKey = headersList.get('x-admin-key')
  const cookieHeader = headersList.get('cookie') ?? ''

  const cookieMatch = cookieHeader.match(/admin_key=([^;]+)/)
  const cookieKey = cookieMatch?.[1]

  const ADMIN_SECRET = process.env.ADMIN_SECRET_KEY
  const isAuthorized =
    (adminKey && adminKey === ADMIN_SECRET) ||
    (cookieKey && cookieKey === ADMIN_SECRET)

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 w-full max-w-sm text-center">
          <h1 className="text-white font-bold text-xl mb-2">Admin Access</h1>
          <p className="text-slate-400 text-sm mb-6">Weka admin key kupata ruhusa</p>
          <AdminKeyForm />
        </div>
      </div>
    )
  }

  const supabase = createAdminClient()
  const { data: landlords } = await supabase
    .from('landlords')
    .select('*')
    .order('created_at', { ascending: false })

  const { data: { users } } = await supabase.auth.admin.listUsers()
  const emailMap = Object.fromEntries(users.map((u) => [u.id, u.email ?? '']))

  const enriched = (landlords ?? []).map((l) => ({
    ...l,
    email: emailMap[l.id] ?? '',
  }))

  return <AdminClient landlords={enriched} />
}
