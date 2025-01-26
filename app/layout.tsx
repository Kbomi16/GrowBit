/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import './globals.css'
import Header from './_components/Header'
import Footer from './_components/Footer'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getToken, onMessage } from 'firebase/messaging'
import { messaging } from '@/app/_libs/firebaseConfig'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = usePathname()

  const hideHeaderPages = ['/', '/login', '/signup']
  const hideHeader = hideHeaderPages.includes(pathname)

  const [notificationPermission, setNotificationPermission] =
    useState<string>('default')
  const [fcmToken, setFcmToken] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined' || !messaging) return

    const requestPermissionAndGetToken = async () => {
      const permission = await Notification.requestPermission()
      setNotificationPermission(permission)

      if (permission === 'granted' && messaging !== null) {
        try {
          const token = await getToken(messaging, {
            vapidKey: process.env.NEXT_PUBLIC_VAPID_KEY,
          })
          if (token) {
            console.log('FCM 토큰:', token)
            setFcmToken(token)
          } else {
            console.error('등록된 Firebase 토큰이 없습니다.')
          }
        } catch (error) {
          console.error('토큰 가져오기 중 오류 발생:', error)
        }
      } else {
        console.error('알림 권한이 거부되었습니다.')
      }
    }

    requestPermissionAndGetToken()

    onMessage(messaging, (payload) => {
      console.log('메시지 수신:', payload)
      const title = payload.notification?.title || '알림'
      const body = payload.notification?.body || '내용이 없습니다.'

      new Notification(title, {
        body,
        icon: '/icons/icon_maskable.png',
      })
    })
  }, [])

  const requestPermissionAgain = async () => {
    const permission = await Notification.requestPermission()
    setNotificationPermission(permission)

    if (permission === 'granted') {
      console.log('알림 권한이 다시 승인되었습니다.')
      if (messaging !== null) {
        try {
          const token = await getToken(messaging, {
            vapidKey: process.env.NEXT_PUBLIC_VAPID_KEY,
          })
          if (token) {
            console.log('Firebase 토큰:', token)
            setFcmToken(token)
          } else {
            console.error('등록된 Firebase 토큰이 없습니다.')
          }
        } catch (error) {
          console.error('토큰 가져오기 중 오류 발생:', error)
        }
      }
    } else {
      console.error('알림 권한이 여전히 거부되었습니다.')
    }
  }

  return (
    <html lang="ko">
      <body>
        {!hideHeader && <Header />}
        {notificationPermission === 'denied' && (
          <div>
            <p>
              알림 권한이 거부되었습니다. 권한을 다시 요청하려면 아래 버튼을
              클릭해주세요.
            </p>
            <button onClick={requestPermissionAgain}>
              알림 권한 다시 요청하기
            </button>
          </div>
        )}
        {children}
        <Footer />
      </body>
    </html>
  )
}
