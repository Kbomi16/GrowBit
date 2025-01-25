/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import AuthGuard from '@/app/_components/AuthGuard'
import { ReactNode, useEffect, useState } from 'react'
import { getToken, onMessage } from 'firebase/messaging'
import { messaging } from '@/app/_libs/firebaseConfig'

export default function MainLayout({ children }: { children: ReactNode }) {
  const [fcmToken, setFcmToken] = useState<string | null>(null)
  const [notificationPermission, setNotificationPermission] =
    useState<string>('default')

  useEffect(() => {
    if (typeof window === 'undefined' || !messaging) return

    const requestPermissionAndGetToken = async () => {
      const permission = await Notification.requestPermission()
      setNotificationPermission(permission)

      if (permission === 'granted' && messaging !== null) {
        try {
          const token = await getToken(messaging, {
            vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
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
      } else {
        console.error('알림 권한이 거부되었거나 messaging이 null입니다.')
      }
    }

    if (messaging !== null) {
      requestPermissionAndGetToken()
    }

    // 메시지 수신 처리
    if (messaging !== null) {
      onMessage(messaging, (payload) => {
        console.log('메시지 수신:', payload)
        const title = payload.notification?.title || '알림'
        const body = payload.notification?.body || '내용이 없습니다.'

        new Notification(title, {
          body,
          icon: '/logo/logo192.png',
        })
      })
    }
  }, []) // MainLayout이 마운트될 때 한번만 실행

  // 알림 권한이 거부된 경우 다시 요청하는 함수
  const requestPermissionAgain = async () => {
    const permission = await Notification.requestPermission()
    setNotificationPermission(permission)

    if (permission === 'granted') {
      console.log('알림 권한이 다시 승인되었습니다.')
      // 알림 토큰을 다시 받기
      if (messaging !== null) {
        try {
          const token = await getToken(messaging, {
            vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
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

  // const testNotification = () => {
  //   if (Notification.permission === 'granted') {
  //     new Notification('테스트 알림', {
  //       body: '이것은 로컬 알림입니다.',
  //       icon: '/icons/icon_maskable.png',
  //     })
  //   } else if (Notification.permission === 'default') {
  //     // 사용자가 알림 권한을 아직 선택하지 않은 경우
  //     console.log('알림 권한을 요청할 필요가 있습니다.')
  //   } else {
  //     console.error('알림 권한이 허용되지 않았습니다.')
  //   }
  // }

  return (
    <AuthGuard>
      <div>
        {/* <button onClick={testNotification}>알림 테스트</button> */}

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
      </div>
    </AuthGuard>
  )
}
