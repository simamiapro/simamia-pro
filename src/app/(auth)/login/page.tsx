'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { Loader2, LogIn, Phone, KeyRound } from 'lucide-react'
import { LanguageSwitcher } from '@/components/shared/language-switcher'
import { useLanguage } from '@/lib/i18n/language-context'

export default function LoginPage() {
  const router = useRouter()
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { t } = useLanguage()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Basic format: ensure it starts with '+'
    let formattedPhone = phone.trim()
    if (!formattedPhone.startsWith('+')) {
      formattedPhone = '+' + formattedPhone
    }

    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithPassword({
      phone: formattedPhone,
      password: password,
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
          <h1 className="text-xl font-semibold text-white mb-1">{t.auth.login_title}</h1>
          <p className="text-slate-400 text-sm">{t.auth.login_subtitle}</p>
        </div>

        {error && (
          <div className="mb-4 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="phone" className="text-sm text-slate-300 font-medium">
              {t.auth.phone}
            </label>
            <div className="relative">
              <input
                id="phone"
                type="tel"
                autoComplete="username"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                placeholder="+2557XXXXXXXX"
                className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-10 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition"
              />
              <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="password" className="text-sm text-slate-300 font-medium">
              {t.auth.password}
            </label>
            <div className="relative">
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-10 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition"
              />
              <KeyRound size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || phone.length < 9 || password.length < 6}
            className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <LogIn size={16} />}
            {loading ? t.auth.logging_in : t.auth.login_btn}
          </button>
        </form>

        <p className="text-center text-sm text-slate-400 mt-6">
          {t.auth.no_account}{' '}
          <Link href="/register" className="text-emerald-400 hover:text-emerald-300 font-medium transition">
            {t.auth.register_btn}
          </Link>
        </p>
      </div>
    </div>
  )
}
