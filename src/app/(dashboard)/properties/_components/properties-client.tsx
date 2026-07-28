'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Building2, Plus, MapPin, Home, ChevronRight, Pencil, Trash2, MoreVertical } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { PropertyForm } from '@/components/shared/property-form'
import { formatTZS } from '@/lib/utils'
import type { Landlord, Property, Unit } from '@/types/database'
import { useLanguage } from '@/lib/i18n/language-context'

interface PropertyWithUnits extends Property {
  units: Unit[]
}

interface PropertiesClientProps {
  properties: PropertyWithUnits[]
  landlord: Landlord
}

export function PropertiesClient({ properties, landlord }: PropertiesClientProps) {
  const router = useRouter()
  const { t } = useLanguage()
  const [showForm, setShowForm] = useState(false)
  const [editProperty, setEditProperty] = useState<Property | undefined>()
  const [menuOpen, setMenuOpen] = useState<string | null>(null)

  async function handleDelete(id: string) {
    if (!confirm('Je, una uhakika wa kufuta mradi huu? Vyumba vyote vitafutwa pia.')) return
    const supabase = createClient()
    await supabase.from('properties').delete().eq('id', id)
    router.refresh()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">{t.properties.title}</h1>
          <p className="text-slate-400 text-sm mt-1">{properties.length} miradi iliyosajiliwa</p>
        </div>
        <button
          onClick={() => { setEditProperty(undefined); setShowForm(true) }}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-xl font-medium text-sm transition shadow-lg shadow-emerald-500/20"
        >
          <Plus size={16} />
          <span className="hidden sm:inline">{t.properties.add_new}</span>
        </button>
      </div>

      {/* Empty state */}
      {properties.length === 0 && (
        <div className="text-center py-20 bg-slate-900/40 border border-slate-800 rounded-2xl">
          <Building2 size={48} className="mx-auto text-slate-600 mb-4" />
          <h3 className="text-white font-semibold mb-2">{t.properties.no_properties}</h3>
          <p className="text-slate-400 text-sm mb-6">{t.properties.add_first}</p>
          <button
            onClick={() => { setEditProperty(undefined); setShowForm(true) }}
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2.5 rounded-xl font-medium text-sm transition"
          >
            {t.properties.add_new}
          </button>
        </div>
      )}

      {/* Property cards grid */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
        {properties.map((property) => {
          const occupiedCount = property.units.filter((u) => u.status === 'occupied').length
          const totalRent = property.units
            .filter((u) => u.status === 'occupied')
            .reduce((sum, u) => sum + (u.monthly_rent || 0), 0)

          return (
            <div key={property.id} className="bg-slate-900/60 border border-slate-800 hover:border-slate-700 rounded-2xl overflow-hidden transition group">
              {/* Card header */}
              <div className="px-5 pt-5 pb-4 border-b border-slate-800">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-center shrink-0">
                      <Building2 size={18} className="text-blue-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-white font-semibold truncate">
                        {property.name || 'Mradi Usio na Jina'}
                      </p>
                      <div className="flex items-center gap-1 text-slate-400 text-xs mt-0.5">
                        <MapPin size={11} />
                        <span className="truncate">{property.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions menu */}
                  <div className="relative shrink-0">
                    <button
                      onClick={() => setMenuOpen(menuOpen === property.id ? null : property.id)}
                      className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
                    >
                      <MoreVertical size={16} />
                    </button>
                    {menuOpen === property.id && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(null)} />
                        <div className="absolute right-0 top-8 z-20 bg-slate-800 border border-slate-700 rounded-xl py-1 w-40 shadow-xl">
                          <button
                            onClick={() => { setEditProperty(property); setShowForm(true); setMenuOpen(null) }}
                            className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-700 transition"
                          >
                            <Pencil size={14} /> {t.common.edit}
                          </button>
                          <button
                            onClick={() => { handleDelete(property.id); setMenuOpen(null) }}
                            className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition"
                          >
                            <Trash2 size={14} /> {t.common.delete}
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="px-5 py-4 grid grid-cols-3 gap-3">
                <div className="text-center">
                  <p className="text-white font-bold text-lg">{property.units.length}</p>
                  <p className="text-slate-400 text-xs">Vyumba</p>
                </div>
                <div className="text-center">
                  <p className="text-emerald-400 font-bold text-lg">{occupiedCount}</p>
                  <p className="text-slate-400 text-xs">Imekaliwa</p>
                </div>
                <div className="text-center">
                  <p className="text-slate-300 font-bold text-sm">{formatTZS(totalRent)}</p>
                  <p className="text-slate-400 text-xs">Kodi/Mwezi</p>
                </div>
              </div>

              {/* View button */}
              <div className="px-5 pb-5">
                <Link
                  href={`/properties/${property.id}`}
                  className="flex items-center justify-center gap-2 w-full bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition group-hover:bg-emerald-600/10 group-hover:text-emerald-400 group-hover:border-emerald-500/30 border border-transparent"
                >
                  Fungua Mradi <ChevronRight size={14} />
                </Link>
              </div>
            </div>
          )
        })}
      </div>

      {showForm && (
        <PropertyForm
          property={editProperty}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  )
}
