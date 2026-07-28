'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { Eye, EyeOff, Loader2, UserPlus } from 'lucide-react'
import { LanguageSwitcher } from '@/components/shared/language-switcher'
import { useLanguage } from '@/lib/i18n/language-context'

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { t } = useLanguage()

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    if (password.length < 8) {
      setError('Nywila lazima iwe na herufi 8 au zaidi.')
      return
    }
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, phone },
      },
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    // The handle_new_user trigger auto-creates the landlords row
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

        <form onSubmit={handleRegister} className="space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2 space-y-1.5">
              <label htmlFor="reg-name" className="text-sm text-slate-300 font-medium">
                {t.tenants.form.name}
              </label>
              <input
                id="reg-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Jina lako"
                className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition"
              />
            </div>

            <div className="col-span-2 space-y-1.5">
              <label htmlFor="reg-phone" className="text-sm text-slate-300 font-medium">
                {t.tenants.form.phone}
              </label>
              <input
                id="reg-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                placeholder="0712 345 678"
                className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="reg-email" className="text-sm text-slate-300 font-medium">
              {t.auth.email}
            </label>
            <input
              id="reg-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="mfano@barua.com"
              className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="reg-password" className="text-sm text-slate-300 font-medium">
              {t.auth.password}
            </label>
            <div className="relative">
              <input
                id="reg-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-2.5 pr-10 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            id="register-submit"
            className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20"
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <UserPlus size={16} />
            )}
            {loading ? t.auth.registering : t.auth.register_btn}
          </button>
        </form>

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
