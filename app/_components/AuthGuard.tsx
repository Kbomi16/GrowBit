'use client'
import { auth } from '@/app/_libs/firebaseConfig'
import { getCookie } from 'cookies-next'
import { onAuthStateChanged } from 'firebase/auth'
import { useRouter } from 'next/navigation'
import { ReactNode, useEffect, useState } from 'react'

interface AuthGuardProps {
  children: ReactNode
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const [isLogin, setIsLogin] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const token = getCookie('token')

    if (token) {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setIsLogin(true)
        } else {
          alert('로그인이 필요합니다.')
          router.push('/login')
        }
      })
    } else {
      alert('로그인이 필요합니다.')
      router.push('/login')
    }
  }, [router])

  if (!isLogin) {
    return <div>로딩 중...</div>
  }

  return <div>{children}</div>
}
