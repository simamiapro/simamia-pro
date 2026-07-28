'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { Loader2, UserPlus, Phone, KeyRound, User } from 'lucide-react'
import { LanguageSwitcher } from '@/components/shared/language-switcher'
import { useLanguage } from '@/lib/i18n/language-context'

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState<1 | 2>(1)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { t } = useLanguage()

  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (name.length < 2) {
      setError('Jina lako lazima liwe na herufi mbili au zaidi.')
      setLoading(false)
      return
    }

    let formattedPhone = phone.trim()
    if (!formattedPhone.startsWith('+')) {
      formattedPhone = '+' + formattedPhone
    }

    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithOtp({
      phone: formattedPhone,
      options: {
        data: {
          name,
          phone: formattedPhone
        }
      }
    })

    if (authError) {
      console.error(authError)
      setError(t.common.error + ': ' + authError.message)
      setLoading(false)
      return
    }

    setLoading(false)
    setStep(2)
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    let formattedPhone = phone.trim()
    if (!formattedPhone.startsWith('+')) {
      formattedPhone = '+' + formattedPhone
    }

    const supabase = createClient()
    const { error: authError } = await supabase.auth.verifyOtp({
      phone: formattedPhone,
      token: otp.trim(),
      type: 'sms',
    })

    if (authError) {
      console.error(authError)
      setError(t.common.error + ': ' + authError.message)
      setLoading(false)
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full max-w-sm mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center relative overflow-hidden bg-slate-900 border border-slate-800">
            <Image src="/logo.png" alt="Simamia Pro" fill className="object-cover" />
          </div>
          <span className="text-white font-bold text-xl tracking-tight">
            Simamia <span className="text-emerald-400">Pro</span>
          </span>
        </div>
        <LanguageSwitcher />
      </div>

      <div className="w-full bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl shadow-black/40">
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-white mb-1">{t.auth.register_title}</h1>
          <p className="text-slate-400 text-sm">{t.auth.register_subtitle}</p>
        </div>

        {error && (
          <div className="mb-4 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-red-400 text-sm">
            {error}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="reg-name" className="text-sm text-slate-300 font-medium">
                {t.tenants.form.name}
              </label>
              <div className="relative">
                <input
                  id="reg-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Jina lako kamili"
                  className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-10 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition"
                />
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="reg-phone" className="text-sm text-slate-300 font-medium">
                {t.auth.phone}
              </label>
              <div className="relative">
                <input
                  id="reg-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  placeholder="+2557XXXXXXXX"
                  className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-10 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition"
                />
                <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
              <p className="text-xs text-slate-500 mt-1">Mfano: +255712345678 au +254712345678</p>
            </div>

            <button
              type="submit"
              disabled={loading || phone.length < 9}
              className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <UserPlus size={16} />}
              {loading ? t.auth.sending : t.auth.send_otp}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="otp" className="text-sm text-slate-300 font-medium">
                {t.auth.otp}
              </label>
              <div className="relative">
                <input
                  id="otp"
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  placeholder="123456"
                  maxLength={6}
                  className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-10 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition text-center tracking-[0.5em] font-mono text-lg"
                />
                <KeyRound size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
              <p className="text-xs text-slate-500 text-center mt-2">
                Namba ya siri imetumwa kwenda: <br/><span className="text-slate-300 font-medium">{phone}</span>
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <UserPlus size={16} />}
              {loading ? t.auth.verifying : t.auth.verify_otp}
            </button>
            
            <button
              type="button"
              onClick={() => {
                setStep(1)
                setOtp('')
                setError(null)
              }}
              className="w-full text-sm text-slate-400 hover:text-white transition"
            >
              {t.common.back}
            </button>
          </form>
        )}

        <p className="text-center text-sm text-slate-400 mt-6">
          {t.auth.has_account}{' '}
          <Link href="/login" className="text-emerald-400 hover:text-emerald-300 font-medium transition">
            {t.auth.login_btn}
          </Link>
        </p>
      </div>
    </div>
  )
}
