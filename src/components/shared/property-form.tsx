'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Loader2, X } from 'lucide-react'
import type { Property } from '@/types/database'
import { useLanguage } from '@/lib/i18n/language-context'

interface PropertyFormProps {
  property?: Property
  onClose: () => void
}

export function PropertyForm({ property, onClose }: PropertyFormProps) {
  const router = useRouter()
  const { t } = useLanguage()
  const isEditing = !!property
  
  const [name, setName] = useState(property?.name ?? '')
  const [location, setLocation] = useState(property?.location ?? '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setError(t.common.error); setLoading(false); return }

    if (isEditing) {
      const { error: err } = await supabase
        .from('properties')
        .update({ name, location })
        .eq('id', property.id)
      if (err) { setError(err.message); setLoading(false); return }
    } else {
      const { error: err } = await supabase
        .from('properties')
        .insert({ landlord_id: user.id, name, property_type: 'apartment', location })
      if (err) { setError(err.message); setLoading(false); return }
    }

    router.refresh()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700/50 rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <h2 className="text-white font-semibold">{isEditing ? t.common.edit : t.properties.add_new}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-sm text-slate-300 font-medium">{t.properties.form.name}</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="e.g. Mradi wa Kasulu"
              className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm text-slate-300 font-medium">{t.properties.form.location}</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              placeholder="e.g. Kasulu, Kigoma"
              className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:text-white hover:border-slate-600 text-sm transition"
            >
              {t.common.cancel}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-medium text-sm flex items-center justify-center gap-2 transition"
            >
              {loading && <Loader2 size={14} className="animate-spin" />}
              {isEditing ? t.common.save : t.common.add}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
