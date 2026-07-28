import { cookies } from 'next/headers'
import { dictionaries, Locale } from './dictionaries'

export async function getDictionary() {
  const cookieStore = await cookies()
  const lang = (cookieStore.get('simamia_lang')?.value as Locale) || 'sw'
  return dictionaries[lang]
}

export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies()
  return (cookieStore.get('simamia_lang')?.value as Locale) || 'sw'
}
