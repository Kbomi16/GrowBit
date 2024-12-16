'use client'
import './globals.css'
import Header from './_components/Header'
import Footer from './_components/Footer'
import { usePathname } from 'next/navigation'

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
      <body>
        {!hideHeader && <Header />} {children}
        <Footer />
      </body>
    </html>
  )
}
