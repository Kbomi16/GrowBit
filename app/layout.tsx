'use client'
import './globals.css'
import Header from './_components/Header'
import Footer from './_components/Footer'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { messaging } from './_libs/firebaseConfig'
import { getToken, onMessage } from 'firebase/messaging'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = usePathname()

  const hideHeaderPages = ['/', '/login', '/signup']
  const hideHeader = hideHeaderPages.includes(pathname)

  useEffect(() => {
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        getToken(messaging, {
          vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
        })
          .then((currentToken) => {
            if (currentToken) {
              console.log('토큰:', currentToken)
              // 서버에 토큰을 저장하는 API 호출
            } else {
              console.log('No registration token available.')
            }
          })
          .catch((err) => {
            console.error('An error occurred while retrieving token:', err)
          })
      }
    })

    onMessage(messaging, (payload) => {
      console.log('Message received. ', payload)
      const title = payload.notification?.title || '알림' // 제목이 없을 경우 기본값 설정
      const body = payload.notification?.body || '내용이 없습니다.' // 내용이 없을 경우 기본값 설정

      new Notification(title, {
        body: body,
        icon: '/logo/logo192.png',
      })
    })
  }, [])

  // 알림 보내기 함수
  const sendNotification = async () => {
    const token = '저장된 토큰' // 서버에 저장된 토큰을 여기에 넣어야 합니다.

    const response = await fetch('/api/send-notification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: '테스트 알림 제목',
        body: '테스트 알림 내용',
        token: token,
      }),
    })

    const data = await response.json()
    console.log(data)
  }

  return (
    <html lang="ko">
      <body>
        {!hideHeader && <Header />}
        <button onClick={sendNotification}>알림 보내기</button>
        {children}
        <Footer />
      </body>
    </html>
  )
}
