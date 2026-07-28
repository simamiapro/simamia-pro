'use client'

import { useState } from 'react'
import { Crown, CreditCard, RefreshCw, Shield, User2, Phone, Calendar, Loader2, Trash2 } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import type { Landlord } from '@/types/database'

interface EnrichedLandlord extends Landlord {
  email: string
}

interface AdminClientProps {
  landlords: EnrichedLandlord[]
}

export function AdminClient({ landlords }: AdminClientProps) {
  const [creditsInput, setCreditsInput] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState<Record<string, boolean>>({})
  const [message, setMessage] = useState<Record<string, string>>({})
  const [localLandlords, setLocalLandlords] = useState(landlords)

  async function apiCall(path: string, body: object, landlordId: string, key: string) {
    setLoading((prev) => ({ ...prev, [key]: true }))
    setMessage((prev) => ({ ...prev, [key]: '' }))

    const res = await fetch(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-key': document.cookie.match(/admin_key=([^;]+)/)?.[1] ?? '' },
      body: JSON.stringify(body),
    })

    const data = await res.json()
    setLoading((prev) => ({ ...prev, [key]: false }))
    setMessage((prev) => ({ ...prev, [key]: res.ok ? '✓ ' + (data.message ?? 'OK') : '✗ ' + (data.error ?? 'Error') }))

    if (res.ok) {
      // Update local state
      setLocalLandlords((prev) =>
        prev.map((l) => (l.id === landlordId ? { ...l, ...data.landlord } : l))
      )
    }
  }

  async function toggleTier(landlord: EnrichedLandlord) {
    const newTier = landlord.account_tier === 'premium' ? 'leniency' : 'premium'
    await apiCall('/api/admin/set-tier', { landlordId: landlord.id, tier: newTier }, landlord.id, `tier-${landlord.id}`)
  }

  async function injectCredits(landlord: EnrichedLandlord) {
    const amount = parseInt(creditsInput[landlord.id] ?? '0', 10)
    if (!amount || amount <= 0) {
      setMessage((prev) => ({ ...prev, [`credits-${landlord.id}`]: '✗ Weka nambari halisi' }))
      return
    }
    await apiCall('/api/admin/inject-credits', { landlordId: landlord.id, amount }, landlord.id, `credits-${landlord.id}`)
    setCreditsInput((prev) => ({ ...prev, [landlord.id]: '' }))
  }

  async function handleDelete(landlord: EnrichedLandlord) {
    if (!confirm(`Uhakika unataka KUFUTA kabisa akaunti ya ${landlord.name || landlord.email}? Vyumba, mali, na wapangaji wao wote watafutwa!`)) return
    
    setLoading((prev) => ({ ...prev, [`delete-${landlord.id}`]: true }))
    
    const res = await fetch('/api/admin/delete-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-key': document.cookie.match(/admin_key=([^;]+)/)?.[1] ?? '' },
      body: JSON.stringify({ landlordId: landlord.id }),
    })
    
    if (res.ok) {
      setLocalLandlords((prev) => prev.filter((l) => l.id !== landlord.id))
    } else {
      setLoading((prev) => ({ ...prev, [`delete-${landlord.id}`]: false }))
      setMessage((prev) => ({ ...prev, [`delete-${landlord.id}`]: '✗ Hitilafu ya kufuta' }))
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-500/15 border border-red-500/30 rounded-xl flex items-center justify-center">
            <Shield size={20} className="text-red-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Admin Panel</h1>
            <p className="text-slate-400 text-sm">{localLandlords.length} wamiliki wote waliowahi kusajiliwa</p>
          </div>
        </div>

        {/* Landlords table */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800">
                  {['Mmiliki', 'Anwani', 'Daraja', 'SMS Credits', 'Tarehe', 'Hatua'].map((h) => (
                    <th key={h} className="text-left text-xs text-slate-400 font-medium px-5 py-4 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {localLandlords.map((landlord) => (
                  <tr key={landlord.id} className="hover:bg-slate-800/20 transition">
                    {/* Name + email */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center shrink-0">
                          <User2 size={14} className="text-slate-400" />
                        </div>
                        <div>
                          <p className="text-white font-medium text-sm">{landlord.name || '—'}</p>
                          <p className="text-slate-400 text-xs">{landlord.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Phone */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 text-slate-300 text-sm">
                        <Phone size={12} className="text-slate-500" />
                        {landlord.phone || '—'}
                      </div>
                    </td>

                    {/* Tier + toggle */}
                    <td className="px-5 py-4">
                      <div className="space-y-1.5">
                        <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium border ${
                          landlord.account_tier === 'premium'
                            ? 'bg-amber-500/15 border-amber-500/30 text-amber-400'
                            : 'bg-slate-700/50 border-slate-600/50 text-slate-400'
                        }`}>
                          {landlord.account_tier === 'premium' && <Crown size={11} />}
                          {landlord.account_tier}
                        </span>
                        <div>
                          <button
                            onClick={() => toggleTier(landlord)}
                            disabled={loading[`tier-${landlord.id}`]}
                            className="flex items-center gap-1.5 text-xs px-2.5 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-slate-300 hover:text-white transition disabled:opacity-50"
                          >
                            {loading[`tier-${landlord.id}`]
                              ? <Loader2 size={10} className="animate-spin" />
                              : <RefreshCw size={10} />
                            }
                            {landlord.account_tier === 'premium' ? 'Punguza → Leniency' : 'Panda → Premium'}
                          </button>
                          {message[`tier-${landlord.id}`] && (
                            <p className={`text-xs mt-1 ${message[`tier-${landlord.id}`].startsWith('✓') ? 'text-emerald-400' : 'text-red-400'}`}>
                              {message[`tier-${landlord.id}`]}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Credits + inject */}
                    <td className="px-5 py-4">
                      <div className="space-y-2">
                        <p className="text-white font-bold text-lg">{landlord.sms_credits}</p>
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            placeholder="Ongeza..."
                            value={creditsInput[landlord.id] ?? ''}
                            onChange={(e) => setCreditsInput((prev) => ({ ...prev, [landlord.id]: e.target.value }))}
                            min={1}
                            max={10000}
                            className="w-24 bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-white text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
                          />
                          <button
                            onClick={() => injectCredits(landlord)}
                            disabled={loading[`credits-${landlord.id}`]}
                            className="flex items-center gap-1 text-xs px-2.5 py-1.5 bg-emerald-600/80 hover:bg-emerald-600 rounded-lg text-white transition disabled:opacity-50"
                          >
                            {loading[`credits-${landlord.id}`]
                              ? <Loader2 size={10} className="animate-spin" />
                              : <CreditCard size={10} />
                            }
                            +
                          </button>
                        </div>
                        {message[`credits-${landlord.id}`] && (
                          <p className={`text-xs ${message[`credits-${landlord.id}`].startsWith('✓') ? 'text-emerald-400' : 'text-red-400'}`}>
                            {message[`credits-${landlord.id}`]}
                          </p>
                        )}
                      </div>
                    </td>

                    {/* Created at */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                        <Calendar size={11} />
                        {formatDate(landlord.created_at)}
                      </div>
                    </td>

                    {/* ID (small) & Delete Action */}
                    <td className="px-5 py-4 text-right">
                      <div className="flex flex-col items-end gap-2">
                        <p className="text-slate-600 text-xs font-mono truncate max-w-[80px]">{landlord.id}</p>
                        <button
                          onClick={() => handleDelete(landlord)}
                          disabled={loading[`delete-${landlord.id}`]}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition disabled:opacity-50"
                        >
                          {loading[`delete-${landlord.id}`] ? (
                            <Loader2 size={12} className="animate-spin" />
                          ) : (
                            <Trash2 size={12} />
                          )}
                          Futa Akaunti
                        </button>
                        {message[`delete-${landlord.id}`] && (
                          <p className="text-xs text-red-400 mt-1">{message[`delete-${landlord.id}`]}</p>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
