'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Plus, Home, Users, Pencil, Trash2, ImageOff, TrendingUp } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { UnitForm } from '@/components/shared/unit-form'
import { formatTZS, ordinal } from '@/lib/utils'
import type { Landlord, Property, Unit, Tenant } from '@/types/database'

interface UnitWithTenant extends Unit {
  tenants: Tenant[]
}

interface PropertyWithUnits extends Property {
  units: UnitWithTenant[]
}

interface PropertyDetailClientProps {
  property: PropertyWithUnits
  landlord: Landlord
  totalUnits: number
}

const PROPERTY_TYPE_LABELS: Record<string, string> = {
  apartment: 'Ghorofa (Apartment)',
  house: 'Nyumba ya Kawaida',
  commercial: 'Fremu ya Biashara',
  bedsitter: 'Bedsitter',
  plot: 'Kipande cha Ardhi',
}

export function PropertyDetailClient({ property, landlord, totalUnits }: PropertyDetailClientProps) {
  const router = useRouter()
  const [showUnitForm, setShowUnitForm] = useState(false)
  const [editUnit, setEditUnit] = useState<Unit | undefined>()

  const tierLocked = landlord.account_tier === 'leniency'

  async function handleDeleteUnit(unitId: string) {
    if (!confirm('Je, una uhakika wa kufuta chumba hiki?')) return
    const supabase = createClient()
    await supabase.from('units').delete().eq('id', unitId)
    router.refresh()
  }

  const occupiedCount = property.units.filter((u) => u.status === 'occupied').length

  return (
    <div className="space-y-6">
      {/* Back + header */}
      <div className="flex items-start gap-4">
        <Link href="/properties" className="mt-1 p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition">
          <ArrowLeft size={18} />
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-white">
            {PROPERTY_TYPE_LABELS[property.property_type] ?? property.property_type}
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">{property.location}</p>
        </div>
        <button
          onClick={() => { setEditUnit(undefined); setShowUnitForm(true) }}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-xl font-medium text-sm transition shadow-lg shadow-emerald-500/20 shrink-0"
        >
          <Plus size={16} />
          <span className="hidden sm:inline">Ongeza Chumba</span>
        </button>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Jumla Vyumba', value: property.units.length, color: 'text-blue-400' },
          { label: 'Imekaliwa', value: occupiedCount, color: 'text-emerald-400' },
          { label: 'Kodi/Mwezi', value: formatTZS(property.units.filter(u => u.status === 'occupied').reduce((s, u) => s + u.monthly_rent, 0)), color: 'text-amber-400' },
        ].map((s) => (
          <div key={s.label} className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-center">
            <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-slate-400 text-xs mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Units grid */}
      {property.units.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/40 border border-slate-800 rounded-2xl">
          <Home size={40} className="mx-auto text-slate-600 mb-3" />
          <h3 className="text-white font-semibold mb-1">Bado huna vyumba</h3>
          <p className="text-slate-400 text-sm mb-5">Ongeza vyumba vya mali hii</p>
          <button
            onClick={() => { setEditUnit(undefined); setShowUnitForm(true) }}
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl font-medium text-sm transition"
          >
            Ongeza Chumba
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {property.units.map((unit) => {
            const tenant = unit.tenants?.[0]
            return (
              <div key={unit.id} className="bg-slate-900/60 border border-slate-800 hover:border-slate-700 rounded-2xl overflow-hidden transition">
                {/* Unit photo */}
                <div className="h-40 bg-slate-800 overflow-hidden relative">
                  {unit.unit_photo_url ? (
                    <img src={unit.unit_photo_url} alt={unit.custom_name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-600">
                      <ImageOff size={28} />
                    </div>
                  )}
                  {/* Status badge */}
                  <div className={`absolute top-3 right-3 text-xs px-2.5 py-1 rounded-full font-medium border ${
                    unit.status === 'occupied'
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                      : 'bg-slate-700/80 text-slate-300 border-slate-600/50'
                  }`}>
                    {unit.status === 'occupied' ? 'Imekaliwa' : 'Wazi'}
                  </div>
                </div>

                {/* Unit info */}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <p className="text-white font-semibold">{unit.custom_name}</p>
                      <p className="text-slate-400 text-xs mt-0.5 mb-1">
                        {
                          unit.unit_type === 'swahili_room' ? 'Chumba Uswahilini' :
                          unit.unit_type === 'hostel_room' ? 'Chumba cha Hostel' :
                          unit.unit_type === 'commercial' ? 'Fremu ya Biashara' :
                          unit.unit_type === 'house' ? 'Nyumba Nzima' :
                          unit.unit_type === 'bedsitter' ? 'Bedsitter / Studio' :
                          'Ghorofa / Apartment'
                        }
                      </p>
                      <p className="text-emerald-400 text-sm font-medium">{formatTZS(unit.monthly_rent)}/mwezi</p>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => { setEditUnit(unit); setShowUnitForm(true) }}
                        className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteUnit(unit.id)}
                        className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Tenant info if occupied */}
                  {tenant ? (
                    <div className="bg-slate-800/50 rounded-lg px-3 py-2">
                      <div className="flex items-center gap-2">
                        <Users size={13} className="text-slate-400" />
                        <p className="text-slate-200 text-sm font-medium truncate">{tenant.name}</p>
                      </div>
                      <p className="text-slate-400 text-xs mt-1 pl-5">
                        Kodi siku ya {ordinal(tenant.rent_due_day)} kila mwezi
                      </p>
                    </div>
                  ) : (
                    <div className="bg-slate-800/30 rounded-lg px-3 py-2 text-center">
                      <p className="text-slate-500 text-xs">Hakuna mpangaji</p>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Unit form modal */}
      {showUnitForm && (
        <UnitForm
          propertyId={property.id}
          unit={editUnit}
          onClose={() => { setShowUnitForm(false); setEditUnit(undefined) }}
          tierLocked={tierLocked}
          totalUnits={totalUnits}
        />
      )}
    </div>
  )
}
