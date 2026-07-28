'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Users, Plus, Loader2, X, Phone, MapPin, Calendar, Pencil, Trash2, Search } from 'lucide-react'
import { formatDate, formatTZS, ordinal } from '@/lib/utils'
import type { Landlord, Tenant } from '@/types/database'

interface VacantUnit {
  id: string
  custom_name: string
  monthly_rent: number
  property_id: string
  properties: { location: string; property_type: string }
}

interface TenantWithUnit extends Tenant {
  units: {
    id: string
    custom_name: string
    monthly_rent: number
    properties: { id: string; location: string; property_type: string }
  }
}

interface TenantsClientProps {
  tenants: TenantWithUnit[]
  vacantUnits: VacantUnit[]
  landlord: Landlord
}

function TenantForm({
  tenant,
  vacantUnits,
  onClose,
}: {
  tenant?: TenantWithUnit
  vacantUnits: VacantUnit[]
  onClose: () => void
}) {
  const router = useRouter()
  const isEditing = !!tenant
  const [name, setName] = useState(tenant?.name ?? '')
  const [phone, setPhone] = useState(tenant?.phone ?? '')
  const [unitId, setUnitId] = useState(tenant?.unit_id ?? '')
  const [moveInDate, setMoveInDate] = useState(tenant?.move_in_date ?? '')
  const [leaseEndDate, setLeaseEndDate] = useState(tenant?.lease_end_date ?? '')
  const [rentDueDay, setRentDueDay] = useState(tenant?.rent_due_day?.toString() ?? '1')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const allUnits = isEditing
    ? [{ id: tenant.unit_id, custom_name: tenant.units.custom_name, monthly_rent: tenant.units.monthly_rent, property_id: tenant.units.properties.id, properties: tenant.units.properties }, ...vacantUnits]
    : vacantUnits

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!unitId) { setError('Chagua chumba'); return }
    setLoading(true)
    setError(null)
    const supabase = createClient()
    const payload = {
      unit_id: unitId,
      name,
      phone,
      move_in_date: moveInDate || null,
      lease_end_date: leaseEndDate || null,
      rent_due_day: parseInt(rentDueDay, 10),
    }

    if (isEditing) {
      const { error: err } = await supabase.from('tenants').update(payload).eq('id', tenant.id)
      if (err) { setError(err.message); setLoading(false); return }
    } else {
      const { error: err } = await supabase.from('tenants').insert(payload)
      if (err) { setError(err.message); setLoading(false); return }
      // Mark unit as occupied
      await supabase.from('units').update({ status: 'occupied' }).eq('id', unitId)
    }

    router.refresh()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700/50 rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 sticky top-0 bg-slate-900">
          <h2 className="text-white font-semibold">{isEditing ? 'Hariri Mpangaji' : 'Ongeza Mpangaji'}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition"><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-red-400 text-sm">{error}</div>}

          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2 space-y-1.5">
              <label className="text-sm text-slate-300 font-medium">Chumba</label>
              <select value={unitId} onChange={(e) => setUnitId(e.target.value)} required
                className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition">
                <option value="">— Chagua Chumba —</option>
                {allUnits.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.custom_name} · {u.properties?.location} ({formatTZS(u.monthly_rent)})
                  </option>
                ))}
              </select>
            </div>

            <div className="col-span-2 space-y-1.5">
              <label className="text-sm text-slate-300 font-medium">Jina Kamili</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Jina la mpangaji"
                className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition" />
            </div>

            <div className="col-span-2 space-y-1.5">
              <label className="text-sm text-slate-300 font-medium">Nambari ya Simu</label>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required placeholder="0712 345 678"
                className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition" />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm text-slate-300 font-medium">Tarehe ya Kuingia</label>
              <input type="date" value={moveInDate} onChange={(e) => setMoveInDate(e.target.value)}
                className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition" />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm text-slate-300 font-medium">Tarehe ya Mwisho wa Mkataba</label>
              <input type="date" value={leaseEndDate} onChange={(e) => setLeaseEndDate(e.target.value)}
                className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition" />
            </div>

            <div className="col-span-2 space-y-1.5">
              <label className="text-sm text-slate-300 font-medium">Siku ya Kulipa Kodi (1-31)</label>
              <input type="number" value={rentDueDay} onChange={(e) => setRentDueDay(e.target.value)} min={1} max={31}
                className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition" />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:text-white text-sm transition">Ghairi</button>
            <button type="submit" disabled={loading} className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-medium text-sm flex items-center justify-center gap-2 transition">
              {loading && <Loader2 size={14} className="animate-spin" />}
              {isEditing ? 'Hifadhi' : 'Ongeza'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export function TenantsClient({ tenants, vacantUnits, landlord }: TenantsClientProps) {
  const router = useRouter()
  const [showForm, setShowForm] = useState(false)
  const [editTenant, setEditTenant] = useState<TenantWithUnit | undefined>()
  const [search, setSearch] = useState('')

  const filtered = tenants.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.phone.includes(search) ||
      t.units?.custom_name?.toLowerCase().includes(search.toLowerCase())
  )

  async function handleDelete(id: string, unitId: string) {
    if (!confirm('Je, una uhakika wa kufuta mpangaji huyu?')) return
    const supabase = createClient()
    await supabase.from('tenants').delete().eq('id', id)
    await supabase.from('units').update({ status: 'vacant' }).eq('id', unitId)
    router.refresh()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Wapangaji</h1>
          <p className="text-slate-400 text-sm mt-1">{tenants.length} wapangaji wote</p>
        </div>
        <button
          onClick={() => { setEditTenant(undefined); setShowForm(true) }}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-xl font-medium text-sm transition shadow-lg shadow-emerald-500/20 shrink-0"
        >
          <Plus size={16} />
          <span className="hidden sm:inline">Ongeza Mpangaji</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Tafuta kwa jina, simu, au chumba..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-slate-900/60 border border-slate-800 rounded-xl pl-11 pr-4 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/40 border border-slate-800 rounded-2xl">
          <Users size={40} className="mx-auto text-slate-600 mb-3" />
          <p className="text-slate-400 text-sm">Hakuna wapangaji waliopo</p>
        </div>
      ) : (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800">
                  {['Mpangaji', 'Chumba', 'Kodi/Mwezi', 'Siku ya Kulipa', 'Mkataba Mwisho', ''].map((h) => (
                    <th key={h} className="text-left text-xs text-slate-400 font-medium px-5 py-3.5 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filtered.map((tenant) => (
                  <tr key={tenant.id} className="hover:bg-slate-800/30 transition">
                    <td className="px-5 py-4">
                      <p className="text-white font-medium text-sm">{tenant.name}</p>
                      <div className="flex items-center gap-1.5 text-slate-400 text-xs mt-0.5">
                        <Phone size={11} />
                        <span>{tenant.phone}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-slate-200 text-sm">{tenant.units?.custom_name}</p>
                      <div className="flex items-center gap-1.5 text-slate-400 text-xs mt-0.5">
                        <MapPin size={11} />
                        <span>{tenant.units?.properties?.location}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-emerald-400 text-sm font-medium whitespace-nowrap">
                      {formatTZS(tenant.units?.monthly_rent ?? 0)}
                    </td>
                    <td className="px-5 py-4 text-slate-300 text-sm whitespace-nowrap">
                      {ordinal(tenant.rent_due_day)} kila mwezi
                    </td>
                    <td className="px-5 py-4 text-slate-400 text-sm whitespace-nowrap">
                      {formatDate(tenant.lease_end_date)}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => { setEditTenant(tenant); setShowForm(true) }}
                          className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(tenant.id, tenant.unit_id)}
                          className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showForm && (
        <TenantForm
          tenant={editTenant}
          vacantUnits={vacantUnits}
          onClose={() => { setShowForm(false); setEditTenant(undefined) }}
        />
      )}
    </div>
  )
}
