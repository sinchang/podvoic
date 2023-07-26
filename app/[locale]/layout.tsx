import '~/app/globals.css'
import 'focus-visible'

import { Manrope } from 'next/font/google'
import { notFound } from 'next/navigation'
import { NextIntlClientProvider } from 'next-intl'

import { getMessages } from '~/app/getMessages'
import { ThemeProvider } from '~/app/ThemeProvider'
import { i18n } from '~/i18n'

const sansFontEn = Manrope({
  weight: ['400', '500', '700'],
  display: 'swap',
  subsets: ['latin'],
  variable: '--font-sans-en',
  fallback: ['ui-sans-serif'],
})

export function generateStaticParams() {
  return i18n.locales.map((locale) => ({ locale }))
}

export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode
  params: RootParams
}) {
  let messages
  try {
    messages = await getMessages(locale)
  } catch (error) {
    notFound()
  }


  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`font-sans ${sansFontEn.variable}`}
    >
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NextIntlClientProvider locale={locale} messages={messages}>
            {children}
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
