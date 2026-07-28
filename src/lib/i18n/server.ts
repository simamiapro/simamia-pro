import { cookies } from 'next/headers'
import { dictionaries, Locale } from './dictionaries'

export function getDictionary() {
  const cookieStore = cookies()
  const lang = (cookieStore.get('simamia_lang')?.value as Locale) || 'sw'
  return dictionaries[lang]
}

export function getLocale(): Locale {
  const cookieStore = cookies()
  return (cookieStore.get('simamia_lang')?.value as Locale) || 'sw'
}
