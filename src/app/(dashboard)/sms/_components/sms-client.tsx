'use client'

import { useState } from 'react'
import { MessageSquare, Send, Lock, AlertCircle, CheckCircle2, Loader2, Users, Building2, CheckCheck } from 'lucide-react'
import { calculateSmsCost, formatTZS } from '@/lib/utils'
import Link from 'next/link'
import type { Landlord } from '@/types/database'

interface Tenant {
  id: string
  name: string
  phone: string
  units: { custom_name: string; properties: { location: string } }
}

interface SmsClientProps {
  landlord: Landlord
  tenants: Tenant[]
}

export function SmsClient({ landlord, tenants }: SmsClientProps) {
  const isPremium = landlord.account_tier === 'premium'
  const [message, setMessage] = useState('')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [selectAll, setSelectAll] = useState(false)
  const [sending, setSending] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  const MAX_CHARS = 300
  const charCount = message.length
  const creditCost = calculateSmsCost(charCount)
  const totalRecipients = selectAll ? tenants.length : selectedIds.size
  const totalCredits = creditCost * totalRecipients

  function toggleTenant(id: string) {
    const next = new Set(selectedIds)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setSelectedIds(next)
    setSelectAll(false)
  }

  function handleSelectAll() {
    if (selectAll) {
      setSelectAll(false)
      setSelectedIds(new Set())
    } else {
      setSelectAll(true)
      setSelectedIds(new Set(tenants.map((t) => t.id)))
    }
  }

  async function handleSend() {
    if (!message.trim() || totalRecipients === 0) return
    if (landlord.sms_credits < totalCredits) {
      setResult({ success: false, message: 'Huna credits za kutosha. Tafadhali ongeza credits.' })
      return
    }
    setSending(true)
    setResult(null)

    const recipientIds = selectAll ? tenants.map((t) => t.id) : Array.from(selectedIds)

    const res = await fetch('/api/sms/broadcast', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, recipientIds }),
    })

    const data = await res.json()
    setSending(false)

    if (res.ok) {
      setResult({ success: true, message: `SMS imetumwa kwa watu ${data.sent} kwa mafanikio. Credits zilitumika: ${data.creditsUsed}` })
      setMessage('')
      setSelectedIds(new Set())
      setSelectAll(false)
    } else {
      setResult({ success: false, message: data.error ?? 'Hitilafu imetokea' })
    }
  }

  // Locked state for leniency tier
  if (!isPremium) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Tuma SMS</h1>
          <p className="text-slate-400 text-sm mt-1">Wasiliana na wapangaji wako kwa SMS</p>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center">
          <div className="w-20 h-20 bg-amber-500/10 border border-amber-500/20 rounded-3xl flex items-center justify-center mx-auto mb-5">
            <Lock size={36} className="text-amber-400" />
          </div>
          <h3 className="text-white text-2xl font-bold mb-3">Panda Daraja la Premium</h3>
          <p className="text-slate-400 max-w-md mx-auto mb-8 leading-relaxed">
            Kutuma SMS kwa wapangaji ni kipengele cha akaunti ya Premium tu. Kwa TZS 5,000 tu kwa mwezi utapata:
          </p>
          <ul className="text-left max-w-md mx-auto space-y-4 mb-8">
            <li className="flex items-center gap-3 text-slate-300">
              <CheckCheck size={18} className="text-emerald-400" /> Vyumba na Miradi <b>Bila Kikomo</b>
            </li>
            <li className="flex items-center gap-3 text-slate-300">
              <CheckCheck size={18} className="text-emerald-400" /> Kutuma SMS (Ujumbe wa kodi, matangazo, n.k.)
            </li>
            <li className="flex items-center gap-3 text-slate-300">
              <CheckCheck size={18} className="text-emerald-400" /> Support ya haraka ya WhatsApp na Simu
            </li>
          </ul>
          <Link
            href="/topup"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white px-8 py-3 rounded-xl font-bold transition shadow-lg shadow-amber-500/20"
          >
            Angalia Vifurushi vya Premium →
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Tuma SMS</h1>
          <p className="text-slate-400 text-sm mt-1">Credits zilizobaki: <span className="text-emerald-400 font-medium">{landlord.sms_credits}</span></p>
        </div>
      </div>

      {result && (
        <div className={`flex items-start gap-3 rounded-xl px-4 py-3 border ${
          result.success
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
            : 'bg-red-500/10 border-red-500/30 text-red-400'
        }`}>
          {result.success ? <CheckCircle2 size={18} className="mt-0.5 shrink-0" /> : <AlertCircle size={18} className="mt-0.5 shrink-0" />}
          <p className="text-sm">{result.message}</p>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Compose panel */}
        <div className="space-y-4">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
            <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
              <MessageSquare size={16} className="text-emerald-400" />
              Andika Ujumbe
            </h2>

            <div className="relative">
              <textarea
                value={message}
                onChange={(e) => e.target.value.length <= MAX_CHARS && setMessage(e.target.value)}
                placeholder="Andika ujumbe wako hapa..."
                rows={6}
                className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition"
              />
              <div className={`absolute bottom-3 right-3 text-xs font-mono ${
                charCount > 250 ? 'text-amber-400' : charCount >= MAX_CHARS ? 'text-red-400' : 'text-slate-500'
              }`}>
                {charCount}/{MAX_CHARS}
              </div>
            </div>

            {/* Cost preview */}
            <div className="mt-3 bg-slate-800/50 rounded-xl p-3 flex items-center justify-between text-sm">
              <div className="text-slate-400">
                <span>Gharama: </span>
                <span className="text-white font-medium">{creditCost} credit{creditCost > 1 ? 's' : ''}/mtu</span>
              </div>
              <div className={`text-xs px-2.5 py-1 rounded-full ${
                charCount <= 160
                  ? 'bg-emerald-500/10 text-emerald-400'
                  : 'bg-amber-500/10 text-amber-400'
              }`}>
                {charCount <= 160 ? 'SMS 1 (≤160)' : 'SMS 2 (161-300)'}
              </div>
            </div>

            {/* Summary */}
            {totalRecipients > 0 && (
              <div className="mt-3 bg-slate-800/50 rounded-xl p-3">
                <p className="text-sm text-slate-300">
                  Jumla: <span className="text-white font-bold">{totalCredits} credits</span>
                  <span className="text-slate-400"> kwa watu {totalRecipients}</span>
                </p>
                {landlord.sms_credits < totalCredits && (
                  <p className="text-red-400 text-xs mt-1">⚠ Credits hazitoshi ({landlord.sms_credits} zilizobaki)</p>
                )}
              </div>
            )}

            <button
              onClick={handleSend}
              disabled={sending || !message.trim() || totalRecipients === 0 || landlord.sms_credits < totalCredits}
              className="mt-4 w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition shadow-lg shadow-emerald-500/20"
            >
              {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              {sending ? 'Inatuma...' : `Tuma kwa ${totalRecipients || 0} Mtu${totalRecipients !== 1 ? 'watu' : ''}`}
            </button>
          </div>
        </div>

        {/* Recipient picker */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold flex items-center gap-2">
              <Users size={16} className="text-emerald-400" />
              Wapokeaji
            </h2>
            <button
              onClick={handleSelectAll}
              className={`text-xs px-3 py-1.5 rounded-lg border transition ${
                selectAll
                  ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                  : 'border-slate-700 text-slate-400 hover:text-white hover:border-slate-600'
              }`}
            >
              {selectAll ? 'Ondoa Wote' : 'Chagua Wote'}
            </button>
          </div>

          {tenants.length === 0 ? (
            <div className="text-center py-10 text-slate-500">
              <Users size={28} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">Bado huna wapangaji</p>
            </div>
          ) : (
            <div className="space-y-1.5 max-h-[360px] overflow-y-auto">
              {tenants.map((tenant) => {
                const selected = selectedIds.has(tenant.id)
                return (
                  <button
                    key={tenant.id}
                    onClick={() => toggleTenant(tenant.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition ${
                      selected
                        ? 'bg-emerald-500/10 border border-emerald-500/20'
                        : 'bg-slate-800/40 border border-transparent hover:bg-slate-800/70'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition ${
                      selected ? 'border-emerald-400 bg-emerald-400' : 'border-slate-600'
                    }`}>
                      {selected && <div className="w-2 h-2 bg-slate-900 rounded-full" />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-white text-sm font-medium truncate">{tenant.name}</p>
                      <p className="text-slate-400 text-xs truncate">
                        {tenant.units?.custom_name} · {tenant.phone}
                      </p>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
