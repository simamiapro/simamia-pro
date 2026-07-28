'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  Building2,
  Users,
  MessageSquare,
  CreditCard,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
} from 'lucide-react'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Landlord } from '@/types/database'
import Image from 'next/image'
import { LanguageSwitcher } from './language-switcher'
import { useLanguage } from '@/lib/i18n/language-context'

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, key: 'dashboard' },
  { href: '/properties', icon: Building2, key: 'properties' },
  { href: '/tenants', icon: Users, key: 'tenants' },
  { href: '/sms', icon: MessageSquare, key: 'sms' },
  { href: '/topup', icon: CreditCard, key: 'topup' },
] as const

interface AppSidebarProps {
  landlord: Landlord
}

export function AppSidebar({ landlord }: AppSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { t } = useLanguage()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className={`flex items-center gap-2.5 px-4 py-5 border-b border-slate-800 ${collapsed ? 'justify-center' : ''}`}>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 relative overflow-hidden bg-slate-900 border border-slate-800">
          <Image src="/logo.png" alt="Simamia Pro" fill className="object-cover" />
        </div>
        {!collapsed && (
          <span className="text-white font-bold text-base tracking-tight">
            Simamia <span className="text-emerald-400">Pro</span>
          </span>
        )}
      </div>

      {/* Language Switcher */}
      {!collapsed && (
        <div className="px-4 py-3 border-b border-slate-800/50">
          <LanguageSwitcher />
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {navItems.map(({ href, icon: Icon, key }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                active
                  ? 'bg-emerald-500/15 text-emerald-400 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              } ${collapsed ? 'justify-center' : ''}`}
            >
              <Icon
                size={18}
                className={`shrink-0 ${active ? 'text-emerald-400' : 'text-slate-400 group-hover:text-white'}`}
              />
              {!collapsed && <span>{t.nav[key]}</span>}
              {!collapsed && active && (
                <div className="ml-auto w-1.5 h-1.5 bg-emerald-400 rounded-full" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Account tier badge */}
      {!collapsed && (
        <div className="px-3 mb-2">
          <div className={`rounded-lg px-3 py-2 flex items-center gap-2 text-xs ${
            landlord.account_tier === 'premium'
              ? 'bg-amber-500/10 border border-amber-500/20 text-amber-400'
              : 'bg-slate-800/60 border border-slate-700/50 text-slate-400'
          }`}>
            <div className={`w-1.5 h-1.5 rounded-full ${landlord.account_tier === 'premium' ? 'bg-amber-400' : 'bg-slate-500'}`} />
            <span className="font-medium">{landlord.account_tier === 'premium' ? 'Premium' : 'Leniency'}</span>
            {landlord.account_tier === 'premium' && (
              <span className="ml-auto text-amber-400/70">{landlord.sms_credits} SMS</span>
            )}
          </div>
        </div>
      )}

      {/* User / Logout */}
      <div className="px-2 pb-4 border-t border-slate-800 pt-3">
        {!collapsed && (
          <div className="px-3 py-2 mb-2">
            <p className="text-white text-sm font-medium truncate">{landlord.name || 'Mtumiaji'}</p>
            <p className="text-slate-500 text-xs truncate">{landlord.phone}</p>
          </div>
        )}
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all ${collapsed ? 'justify-center' : ''}`}
        >
          <LogOut size={18} className="shrink-0" />
          {!collapsed && <span>{t.nav.logout}</span>}
        </button>
      </div>
    </>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={`hidden lg:flex flex-col h-screen sticky top-0 bg-slate-900/95 backdrop-blur-sm border-r border-slate-800 transition-all duration-300 ${
          collapsed ? 'w-16' : 'w-60'
        }`}
      >
        {sidebarContent}
        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 w-6 h-6 bg-slate-800 border border-slate-700 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition z-10"
        >
          {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800 flex items-center px-4 py-3 gap-3">
        <button onClick={() => setMobileOpen(true)} className="text-slate-400 hover:text-white transition">
          <Menu size={20} />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center relative overflow-hidden bg-slate-900 border border-slate-800">
            <Image src="/logo.png" alt="Simamia Pro" fill className="object-cover" />
          </div>
          <span className="text-white font-semibold text-sm">
            Simamia <span className="text-emerald-400">Pro</span>
          </span>
        </div>
      </div>

      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`lg:hidden fixed top-0 left-0 h-full z-50 w-64 bg-slate-900 border-r border-slate-800 flex flex-col transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-4 right-4 text-slate-400 hover:text-white"
        >
          <X size={18} />
        </button>
        {sidebarContent}
      </aside>
    </>
  )
}
