'use client'
import AuthGuard from '@/app/_components/AuthGuard'
import { ReactNode } from 'react'

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      <div>{children}</div>
    </AuthGuard>
  )
}
