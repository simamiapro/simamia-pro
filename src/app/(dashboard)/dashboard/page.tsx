import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Building2, Users, Home, MessageSquare, TrendingUp, AlertCircle, Clock, CreditCard, Star, CheckCircle2, CalendarDays } from 'lucide-react'
import Link from 'next/link'
import { daysUntilRentDue, formatTZS, getRentStatusColor } from '@/lib/utils'
import { getDictionary } from '@/lib/i18n/server'
import type { Landlord } from '@/types/database'

export const metadata = {
  title: 'Dashibodi',
}

export default async function DashboardPage() {
  const t = await getDictionary()
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [
    { data: landlord },
    { data: properties },
    { data: units },
    { data: tenants },
  ] = await Promise.all([
    supabase.from('landlords').select('*').eq('id', user.id).single(),
    supabase.from('properties').select('*').eq('landlord_id', user.id),
    supabase
      .from('units')
      .select('*, properties!inner(landlord_id)')
      .eq('properties.landlord_id', user.id),
    supabase
      .from('tenants')
      .select('*, units!inner(property_id, monthly_rent, custom_name, properties!inner(landlord_id, location))')
      .eq('units.properties.landlord_id', user.id),
  ])

  const metrics = {
    properties: properties?.length ?? 0,
    units: units?.length ?? 0,
    occupiedUnits: units?.filter((u) => u.status === 'occupied').length ?? 0,
    tenants: tenants?.length ?? 0
  }

  const occupiedUnits = metrics.occupiedUnits
  const vacantUnits = metrics.units - occupiedUnits
  const occupancyRate = metrics.units > 0 ? Math.round((occupiedUnits / metrics.units) * 100) : 0

  const isPremium = (landlord as Landlord)?.account_tier === 'premium'

  const rentDues = (tenants ?? [])
    .map((t) => ({
      ...t,
      daysUntil: daysUntilRentDue(t.rent_due_day),
    }))
    .sort((a, b) => a.daysUntil - b.daysUntil)
    .slice(0, 10)

  return (
    <div className="max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">
          {t.dashboard.welcome} <span className="text-emerald-400">{(landlord as Landlord)?.name?.split(' ')[0] || 'Mtumiaji'}</span> 👋
        </h1>
        <p className="text-slate-400">
          {isPremium ? (
            <span className="text-emerald-400/80 font-medium">Premium Account</span>
          ) : (
            <span className="text-amber-400/80 font-medium">Toleo la Bure</span>
          )}
        </p>
      </div>

      {!isPremium && (
        <div className="my-8 bg-gradient-to-r from-amber-500/10 to-amber-500/5 border border-amber-500/20 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <h3 className="text-amber-400 font-semibold mb-1 flex items-center gap-2">
              <Star size={16} /> {t.dashboard.premium_banner.title}
            </h3>
            <p className="text-amber-400/70 text-sm">
              {t.dashboard.premium_banner.desc}
            </p>
          </div>
          <Link href="/topup" className="bg-amber-500 hover:bg-amber-400 text-amber-950 px-4 py-2 rounded-xl text-sm font-medium transition shadow-lg shadow-amber-500/20">
            {t.dashboard.premium_banner.btn}
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 my-8">
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
            <Building2 size={20} />
          </div>
          <div>
            <p className="text-slate-400 text-sm font-medium mb-1">{t.dashboard.metrics.total_properties}</p>
            <h3 className="text-2xl font-bold text-white">{metrics.properties}</h3>
          </div>
        </div>
        
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0">
            <Home size={20} />
          </div>
          <div>
            <p className="text-slate-400 text-sm font-medium mb-1">{t.dashboard.metrics.total_units}</p>
            <h3 className="text-2xl font-bold text-white">{metrics.units}</h3>
          </div>
        </div>

        <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle2 size={20} />
          </div>
          <div>
            <p className="text-slate-400 text-sm font-medium mb-1">{t.dashboard.metrics.occupied_units}</p>
            <h3 className="text-2xl font-bold text-white">{metrics.occupiedUnits}</h3>
          </div>
        </div>

        <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
            <Users size={20} />
          </div>
          <div>
            <p className="text-slate-400 text-sm font-medium mb-1">{t.dashboard.metrics.total_tenants}</p>
            <h3 className="text-2xl font-bold text-white">{metrics.tenants}</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-slate-800/20 border border-slate-700/50 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <CalendarDays size={18} />
            </div>
            <h2 className="text-lg font-semibold text-white">{t.dashboard.rent_status.title}</h2>
          </div>

          {rentDues.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <Clock size={32} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">{t.dashboard.rent_status.no_tenants}</p>
            </div>
          ) : (
            <div className="space-y-2">
              {rentDues.map((tenant) => {
                const status = getRentStatusColor(tenant.daysUntil, t.dashboard.rent_status)
                const tenantAny = tenant as any
                const unit = tenantAny.units
                const property = unit?.properties
                return (
                  <div
                    key={tenant.id}
                    className="flex items-center justify-between py-3 px-4 bg-slate-800/40 hover:bg-slate-800/70 rounded-xl transition"
                  >
                    <div className="min-w-0">
                      <p className="text-white text-sm font-medium truncate">{tenant.name}</p>
                      <p className="text-slate-400 text-xs truncate">
                        {unit?.custom_name} · {property?.location}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0 ml-4">
                      <span className="text-slate-300 text-sm font-medium">
                        {formatTZS(unit?.monthly_rent ?? 0)}
                      </span>
                      <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${status.badge}`}>
                        {status.label}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Quick stats sidebar */}
        <div className="space-y-4">
          {/* Occupancy ring */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 text-center">
            <h3 className="text-slate-400 text-sm font-medium mb-4">Kiwango cha Ukazi</h3>
            <div className="relative w-32 h-32 mx-auto">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#1e293b" strokeWidth="3" />
                <circle
                  cx="18"
                  cy="18"
                  r="15.9"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray={`${occupancyRate} 100`}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-white">{occupancyRate}%</span>
                <span className="text-xs text-slate-400">Imekaliwa</span>
              </div>
            </div>
            <div className="flex justify-center gap-6 mt-4 text-xs text-slate-400">
              <div>
                <p className="text-emerald-400 font-bold text-lg">{occupiedUnits}</p>
                <p>Imekaliwa</p>
              </div>
              <div>
                <p className="text-slate-300 font-bold text-lg">{vacantUnits}</p>
                <p>Wazi</p>
              </div>
            </div>
          </div>

          {/* SMS Credits */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <MessageSquare size={16} className="text-emerald-400" />
              <h3 className="text-slate-300 text-sm font-medium">SMS Credits</h3>
            </div>
            <p className="text-3xl font-bold text-white">{(landlord as Landlord)?.sms_credits ?? 0}</p>
            <p className="text-slate-400 text-xs mt-1">Credits zilizobaki</p>
            <Link
              href="/topup"
              className="mt-4 block text-center text-sm bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 rounded-xl py-2 transition"
            >
              Ongeza Credits
            </Link>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { href: '/properties', label: 'Ongeza Mali', icon: Building2, color: 'blue' },
          { href: '/tenants', label: 'Ongeza Mpangaji', icon: Users, color: 'purple' },
          { href: '/sms', label: 'Tuma SMS', icon: MessageSquare, color: 'emerald' },
          { href: '/topup', label: 'Top Up', icon: CreditCard, color: 'amber' },
        ].map(({ href, label, icon: Icon, color }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-3 bg-slate-900/60 hover:bg-slate-800/60 border border-slate-800 hover:border-slate-700 rounded-xl px-4 py-3.5 transition group"
          >
            <Icon size={16} className={`text-${color}-400 group-hover:scale-110 transition-transform`} />
            <span className="text-slate-300 text-sm font-medium">{label}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
