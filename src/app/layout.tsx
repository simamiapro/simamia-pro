import type { Metadata, Viewport } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
})

export const metadata: Metadata = {
  title: {
    default: 'Simamia Pro — Usimamizi wa Mali ya Kukodisha',
    template: '%s | Simamia Pro',
  },
  description:
    'Jukwaa la kisasa kwa wamiliki wa nyumba Tanzania kusimamia mali, wapangaji, na ukusanyaji wa kodi kwa urahisi.',
  keywords: ['property management', 'Tanzania', 'landlord', 'kodi', 'rent', 'M-Pesa'],
  appleWebApp: {
    capable: true,
    title: 'Simamia Pro',
    statusBarStyle: 'black-translucent',
  },
}

export const viewport: Viewport = {
  themeColor: '#0f172a',
}

import { LanguageProvider } from '@/lib/i18n/language-context'
import { getLocale } from '@/lib/i18n/server'
import { PwaRegistrar } from '@/components/pwa-registrar'

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const locale = await getLocale()
  
  return (
    <html lang={locale} className={`${geist.variable} dark`}>
      <body className="bg-background text-foreground antialiased min-h-screen">
        <LanguageProvider initialLocale={locale}>
          {children}
          <PwaRegistrar />
        </LanguageProvider>
      </body>
    </html>
  )
}
