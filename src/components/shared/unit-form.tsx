'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Loader2, X, ImagePlus, Lock } from 'lucide-react'
import type { Unit } from '@/types/database'
import { useLanguage } from '@/lib/i18n/language-context'

interface UnitFormProps {
  propertyId: string
  unit?: Unit
  onClose: () => void
  tierLocked?: boolean
  totalUnits?: number
}

export function UnitForm({ propertyId, unit, onClose, tierLocked, totalUnits }: UnitFormProps) {
  const router = useRouter()
  const { t } = useLanguage()
  const isEditing = !!unit
  const fileRef = useRef<HTMLInputElement>(null)
  
  const [unitType, setUnitType] = useState(unit?.unit_type ?? 'apartment')
  const [customName, setCustomName] = useState(unit?.custom_name ?? '')
  const [monthlyRent, setMonthlyRent] = useState(unit?.monthly_rent?.toString() ?? '')
  const [status, setStatus] = useState<'vacant' | 'occupied'>(unit?.status ?? 'vacant')
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(unit?.unit_photo_url ?? null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const UNIT_TYPES = [
    { value: 'apartment', label: t.units.form.types.apartment },
    { value: 'house', label: t.units.form.types.house },
    { value: 'commercial', label: t.units.form.types.commercial },
    { value: 'swahili_room', label: t.units.form.types.swahili_room },
    { value: 'hostel_room', label: t.units.form.types.hostel_room },
    { value: 'bedsitter', label: t.units.form.types.bedsitter },
  ]

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setPhotoFile(file)
    setPhotoPreview(URL.createObjectURL(file))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (tierLocked && !isEditing && (totalUnits ?? 0) >= 5) {
      setError('Umefika kikomo cha vyumba 5. Panda daraja la Premium.')
      return
    }
    setLoading(true)
    setError(null)

    const supabase = createClient()
    let photoUrl = unit?.unit_photo_url ?? null

    // Upload photo if selected
    if (photoFile) {
      const ext = photoFile.name.split('.').pop()
      const path = `${propertyId}/${Date.now()}.${ext}`
      const { error: uploadErr } = await supabase.storage
        .from('unit-photos')
        .upload(path, photoFile, { upsert: true })
      if (uploadErr) {
        setError(t.units.form.photo_error + ' ' + uploadErr.message)
        setLoading(false)
        return
      }
      const { data: urlData } = supabase.storage.from('unit-photos').getPublicUrl(path)
      photoUrl = urlData.publicUrl
    }

    const payload = {
      property_id: propertyId,
      unit_type: unitType,
      custom_name: customName,
      monthly_rent: parseInt(monthlyRent, 10) || 0,
      status,
      unit_photo_url: photoUrl,
    }

    if (isEditing) {
      const { error: err } = await supabase.from('units').update(payload).eq('id', unit.id)
      if (err) { setError(err.message); setLoading(false); return }
    } else {
      const { error: err } = await supabase.from('units').insert(payload)
      if (err) { setError(err.message); setLoading(false); return }
    }

    router.refresh()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700/50 rounded-2xl w-full max-w-md shadow-2xl overflow-y-auto max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 sticky top-0 bg-slate-900 z-10">
          <h2 className="text-white font-semibold">{isEditing ? t.common.edit : t.units.add_new}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition">
            <X size={18} />
          </button>
        </div>

        {/* Tier gate UI */}
        {tierLocked && !isEditing && (totalUnits ?? 0) >= 5 ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Lock size={28} className="text-amber-400" />
            </div>
            <h3 className="text-white font-semibold mb-2">{t.units.form.limit_reached}</h3>
            <p className="text-slate-400 text-sm mb-6">
              {t.units.form.limit_desc}
            </p>
            <button
              onClick={() => {
                onClose()
                router.push('/topup')
              }}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white font-medium text-sm transition shadow-lg shadow-amber-500/20"
            >
              Angalia Vifurushi vya Premium →
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Photo upload */}
            <div
              onClick={() => fileRef.current?.click()}
              className="border-2 border-dashed border-slate-700 hover:border-emerald-500/50 rounded-xl h-32 flex items-center justify-center cursor-pointer transition overflow-hidden relative group"
            >
              {photoPreview ? (
                <>
                  <img src={photoPreview} alt="picha" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                    <ImagePlus size={20} className="text-white" />
                  </div>
                </>
              ) : (
                <div className="text-center">
                  <ImagePlus size={20} className="text-slate-500 mx-auto mb-1" />
                  <p className="text-slate-500 text-xs">{t.units.form.upload_photo}</p>
                </div>
              )}
              <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm text-slate-300 font-medium">{t.units.form.type}</label>
              <select
                value={unitType}
                onChange={(e) => setUnitType(e.target.value)}
                className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition"
              >
                {UNIT_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm text-slate-300 font-medium">{t.units.form.custom_name}</label>
              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                required
                placeholder={t.units.form.custom_name_placeholder}
                className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm text-slate-300 font-medium">{t.units.monthly_rent} (TZS)</label>
              <input
                type="number"
                value={monthlyRent}
                onChange={(e) => setMonthlyRent(e.target.value)}
                required
                min={0}
                placeholder="mfano: 350000"
                className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm text-slate-300 font-medium">{t.units.form.status}</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as 'vacant' | 'occupied')}
                className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition"
              >
                <option value="vacant">{t.units.status.vacant}</option>
                <option value="occupied">{t.units.status.occupied}</option>
              </select>
            </div>

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:text-white text-sm transition">
                {t.common.cancel}
              </button>
              <button type="submit" disabled={loading} className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-medium text-sm flex items-center justify-center gap-2 transition">
                {loading && <Loader2 size={14} className="animate-spin" />}
                {isEditing ? t.common.save : t.common.add}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
