import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'GrowBit',
  description: '조금씩(grow) 성장하는 습관(bit)',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <body>
        <header></header>
        {children}
        <footer></footer>
      </body>
    </html>
  )
}
