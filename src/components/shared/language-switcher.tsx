'use client'

import { useLanguage } from '@/lib/i18n/language-context'

export function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage()

  return (
    <div className="flex items-center gap-1 bg-slate-800/50 p-1 rounded-lg border border-slate-700/50 text-xs">
      <button
        onClick={() => setLocale('sw')}
        className={`px-2.5 py-1.5 rounded-md transition-all font-medium ${
          locale === 'sw'
            ? 'bg-slate-700 text-white shadow-sm'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        SW
      </button>
      <button
        onClick={() => setLocale('en')}
        className={`px-2.5 py-1.5 rounded-md transition-all font-medium ${
          locale === 'en'
            ? 'bg-slate-700 text-white shadow-sm'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        EN
      </button>
    </div>
  )
}
