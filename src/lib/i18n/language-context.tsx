'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { dictionaries, Dictionary, Locale } from './dictionaries'
import { useRouter } from 'next/navigation'

interface LanguageContextType {
  locale: Locale
  t: Dictionary
  setLocale: (locale: Locale) => void
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({
  children,
  initialLocale = 'sw',
}: {
  children: React.ReactNode
  initialLocale?: Locale
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale)
  const router = useRouter()

  useEffect(() => {
    // Sync with localStorage on client mount if it differs from cookie
    const stored = localStorage.getItem('simamia_lang') as Locale
    if (stored && stored !== initialLocale) {
      setLocale(stored)
    }
  }, [])

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale)
    localStorage.setItem('simamia_lang', newLocale)
    document.cookie = `simamia_lang=${newLocale}; path=/; max-age=31536000` // 1 year
    router.refresh() // Refresh server components to use new language
  }

  const t = dictionaries[locale]

  return (
    <LanguageContext.Provider value={{ locale, t, setLocale }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
