import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AppSidebar } from '@/components/shared/app-sidebar'
import type { Landlord } from '@/types/database'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: landlord } = await supabase
    .from('landlords')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!landlord) redirect('/login')

  return (
    <div className="flex min-h-screen bg-slate-950">
      <AppSidebar landlord={landlord as Landlord} />

      {/* Main content area */}
      <main className="flex-1 min-w-0 lg:pl-0 pt-14 lg:pt-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  )
}
