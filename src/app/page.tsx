'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Building2, Users, MessageSquare, Smartphone, ArrowRight, Sparkles, Shield, ChevronRight } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/language-context'
import { LanguageSwitcher } from '@/components/shared/language-switcher'

export default function LandingPage() {
  const { t } = useLanguage()

  const features = [
    {
      icon: Building2,
      title: t.landing.feat_properties_title,
      desc: t.landing.feat_properties_desc,
      gradient: 'from-blue-500 to-blue-600',
      glow: 'shadow-blue-500/20',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20',
      iconColor: 'text-blue-400',
    },
    {
      icon: Users,
      title: t.landing.feat_tenants_title,
      desc: t.landing.feat_tenants_desc,
      gradient: 'from-purple-500 to-purple-600',
      glow: 'shadow-purple-500/20',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/20',
      iconColor: 'text-purple-400',
    },
    {
      icon: MessageSquare,
      title: t.landing.feat_sms_title,
      desc: t.landing.feat_sms_desc,
      gradient: 'from-emerald-500 to-emerald-600',
      glow: 'shadow-emerald-500/20',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      iconColor: 'text-emerald-400',
    },
    {
      icon: Smartphone,
      title: t.landing.feat_mpesa_title,
      desc: t.landing.feat_mpesa_desc,
      gradient: 'from-amber-500 to-amber-600',
      glow: 'shadow-amber-500/20',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
      iconColor: 'text-amber-400',
    },
  ]

  return (
    <div className="min-h-screen bg-slate-950 overflow-hidden">
      {/* ──────── Ambient Background ──────── */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Top-left emerald glow */}
        <div className="absolute -top-48 -left-48 w-[600px] h-[600px] bg-emerald-500/[0.07] rounded-full blur-[128px]" />
        {/* Bottom-right blue glow */}
        <div className="absolute -bottom-48 -right-48 w-[500px] h-[500px] bg-blue-500/[0.05] rounded-full blur-[128px]" />
        {/* Center subtle glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-500/[0.03] rounded-full blur-[128px]" />
        {/* Dot grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      {/* ──────── Navbar ──────── */}
      <header className="relative z-20 border-b border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center relative overflow-hidden bg-slate-900 border border-slate-700/50 shadow-lg shadow-emerald-500/10 group-hover:shadow-emerald-500/20 transition-shadow">
              <Image src="/logo.png" alt="Simamia Pro" fill className="object-cover" />
            </div>
            <span className="text-white font-bold text-lg tracking-tight">
              Simamia <span className="text-emerald-400">Pro</span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <Link
              href="/login"
              className="hidden sm:inline-flex items-center gap-1.5 text-sm text-slate-300 hover:text-white px-4 py-2 rounded-xl hover:bg-white/[0.06] transition-all"
            >
              {t.auth.login_btn}
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded-xl transition-all shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30"
            >
              {t.auth.register_btn}
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </header>

      {/* ──────── Hero Section ──────── */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pt-20 sm:pt-28 pb-20 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-emerald-500/[0.08] border border-emerald-500/20 rounded-full px-4 py-1.5 mb-8 backdrop-blur-sm">
          <Sparkles size={14} className="text-emerald-400" />
          <span className="text-emerald-300 text-xs sm:text-sm font-medium tracking-wide">
            {t.landing.hero_badge}
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.1] tracking-tight mb-6">
          {t.landing.hero_title_1}
          <br />
          <span className="bg-gradient-to-r from-emerald-400 via-emerald-300 to-teal-400 bg-clip-text text-transparent">
            {t.landing.hero_title_2}
          </span>
        </h1>

        {/* Description */}
        <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed mb-10">
          {t.landing.hero_desc}
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link
            href="/register"
            className="group inline-flex items-center gap-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-semibold px-7 py-3.5 rounded-2xl text-sm sm:text-base transition-all shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.02] active:scale-[0.98]"
          >
            {t.landing.cta_start}
            <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm font-medium px-6 py-3.5 rounded-2xl border border-slate-700/50 hover:border-slate-600 hover:bg-white/[0.04] transition-all"
          >
            {t.landing.cta_login}
            <ChevronRight size={14} />
          </Link>
        </div>

        {/* Dashboard Preview Mockup */}
        <div className="relative max-w-4xl mx-auto">
          {/* Glow behind the card */}
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/10 to-transparent rounded-3xl blur-2xl scale-105" />

          <div className="relative bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl sm:rounded-3xl shadow-2xl shadow-black/50 overflow-hidden">
            {/* Window chrome */}
            <div className="flex items-center gap-2 px-5 py-3.5 border-b border-slate-700/50 bg-slate-900/60">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/70" />
                <div className="w-3 h-3 rounded-full bg-amber-500/70" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/70" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="bg-slate-800/80 rounded-lg px-4 py-1 text-xs text-slate-400 font-mono">
                  simamia-pro.vercel.app/dashboard
                </div>
              </div>
            </div>

            {/* Simulated dashboard content */}
            <div className="p-5 sm:p-8">
              {/* Metric cards row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
                {[
                  { label: t.dashboard.metrics.total_properties, value: '12', color: 'text-blue-400', bg: 'bg-blue-500/10' },
                  { label: t.dashboard.metrics.total_units, value: '48', color: 'text-purple-400', bg: 'bg-purple-500/10' },
                  { label: t.dashboard.metrics.occupied_units, value: '41', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                  { label: t.dashboard.metrics.total_tenants, value: '41', color: 'text-amber-400', bg: 'bg-amber-500/10' },
                ].map((m) => (
                  <div key={m.label} className="bg-slate-800/50 border border-slate-700/30 rounded-xl p-4">
                    <p className="text-slate-500 text-xs font-medium mb-1 truncate">{m.label}</p>
                    <p className={`text-xl sm:text-2xl font-bold ${m.color}`}>{m.value}</p>
                  </div>
                ))}
              </div>

              {/* Simulated table skeleton */}
              <div className="bg-slate-800/30 border border-slate-700/20 rounded-xl p-4 space-y-3">
                {[0.9, 0.75, 0.6, 0.45].map((opacity, i) => (
                  <div key={i} className="flex items-center gap-4" style={{ opacity }}>
                    <div className="w-8 h-8 rounded-lg bg-slate-700/50 shrink-0" />
                    <div className="flex-1 space-y-1.5">
                      <div className="h-3 bg-slate-700/40 rounded-full w-1/3" />
                      <div className="h-2.5 bg-slate-700/25 rounded-full w-1/2" />
                    </div>
                    <div className="h-6 w-20 bg-emerald-500/10 border border-emerald-500/20 rounded-full" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ──────── Social Proof Strip ──────── */}
      <section className="relative z-10 border-y border-white/[0.06] bg-slate-900/40 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
          <div className="flex -space-x-2">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full border-2 border-slate-900 bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center"
              >
                <span className="text-[10px] text-white font-bold">
                  {['A', 'M', 'J', 'S', 'K'][i]}
                </span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 20 20">
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
              </svg>
            ))}
          </div>
          <p className="text-slate-400 text-sm">
            {t.landing.social_proof}
          </p>
        </div>
      </section>

      {/* ──────── Features Section ──────── */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-slate-800/50 border border-slate-700/50 rounded-full px-4 py-1.5 mb-6">
            <Shield size={14} className="text-emerald-400" />
            <span className="text-slate-300 text-xs sm:text-sm font-medium">{t.landing.features_title}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            {t.landing.features_title}
          </h2>
          <p className="text-slate-400 text-base sm:text-lg max-w-xl mx-auto">
            {t.landing.features_desc}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {features.map((feat) => (
            <div
              key={feat.title}
              className={`group relative bg-slate-900/60 backdrop-blur-sm border ${feat.border} rounded-2xl p-7 hover:bg-slate-900/80 transition-all duration-300 hover:shadow-xl ${feat.glow} hover:-translate-y-0.5`}
            >
              <div className={`w-12 h-12 ${feat.bg} rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                <feat.icon size={22} className={feat.iconColor} />
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">{feat.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ──────── Final CTA Section ──────── */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pb-24">
        <div className="relative overflow-hidden bg-gradient-to-br from-emerald-500/[0.12] to-emerald-600/[0.06] border border-emerald-500/20 rounded-3xl p-10 sm:p-16 text-center">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              {t.landing.hero_title_1} {t.landing.hero_title_2}
            </h2>
            <p className="text-emerald-200/60 text-base max-w-lg mx-auto mb-8">
              {t.landing.hero_desc}
            </p>
            <Link
              href="/register"
              className="group inline-flex items-center gap-2 bg-white text-slate-900 font-semibold px-8 py-3.5 rounded-2xl text-sm sm:text-base transition-all hover:bg-emerald-50 shadow-xl shadow-black/20 hover:scale-[1.02] active:scale-[0.98]"
            >
              {t.landing.cta_start}
              <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* ──────── Footer ──────── */}
      <footer className="relative z-10 border-t border-white/[0.06] bg-slate-950/80">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            {/* Brand column */}
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center relative overflow-hidden bg-slate-900 border border-slate-800">
                  <Image src="/logo.png" alt="Simamia Pro" fill className="object-cover" />
                </div>
                <span className="text-white font-bold text-base tracking-tight">
                  Simamia <span className="text-emerald-400">Pro</span>
                </span>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
                {t.landing.footer_tagline}
              </p>
            </div>

            {/* Product */}
            <div>
              <h4 className="text-white font-semibold text-sm mb-4">{t.landing.footer_product}</h4>
              <ul className="space-y-2.5">
                <li><Link href="/register" className="text-slate-400 hover:text-white text-sm transition">{t.nav.dashboard}</Link></li>
                <li><Link href="/register" className="text-slate-400 hover:text-white text-sm transition">{t.nav.properties}</Link></li>
                <li><Link href="/register" className="text-slate-400 hover:text-white text-sm transition">{t.nav.tenants}</Link></li>
                <li><Link href="/register" className="text-slate-400 hover:text-white text-sm transition">{t.nav.sms}</Link></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-white font-semibold text-sm mb-4">{t.landing.footer_support}</h4>
              <ul className="space-y-2.5">
                <li><Link href="/register" className="text-slate-400 hover:text-white text-sm transition">{t.landing.footer_contact}</Link></li>
                <li><Link href="/register" className="text-slate-400 hover:text-white text-sm transition">FAQ</Link></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-white font-semibold text-sm mb-4">{t.landing.footer_legal}</h4>
              <ul className="space-y-2.5">
                <li><Link href="/register" className="text-slate-400 hover:text-white text-sm transition">{t.landing.footer_privacy}</Link></li>
                <li><Link href="/register" className="text-slate-400 hover:text-white text-sm transition">{t.landing.footer_terms}</Link></li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-slate-500 text-xs">
              © {new Date().getFullYear()} Simamia Pro. {t.landing.footer_rights}
            </p>
            <LanguageSwitcher />
          </div>
        </div>
      </footer>
    </div>
  )
}
