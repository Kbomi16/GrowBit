'use client'
import './globals.css'
import Header from './_components/Header'
import Footer from './_components/Footer'
import { usePathname } from 'next/navigation'
import Head from 'next/head'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = usePathname()

  const hideHeaderPages = ['/', '/login', '/signup']
  const hideHeader = hideHeaderPages.includes(pathname)

  return (
    <html lang="ko">
      <Head>
        <link rel="manifest" href="/manifest.json" />
      </Head>
      <body>
        {!hideHeader && <Header />} {children}
        <Footer />
      </body>
    </html>
  )
}
