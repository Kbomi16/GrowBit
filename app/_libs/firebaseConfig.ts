import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import {
  getMessaging,
  getToken,
  onMessage,
  MessagePayload,
} from 'firebase/messaging'

// Firebase 설정
export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID,
}

// Firebase 초기화
const app = initializeApp(firebaseConfig)

// Firebase 서비스 객체 생성
export const auth = getAuth(app)
export const db = getFirestore(app)

export const messaging =
  typeof window !== 'undefined' ? getMessaging(app) : null

// 클라이언트에서 푸시 토큰 가져오기
export const requestForToken = async () => {
  if (!messaging) return // 서버 환경에서는 실행하지 않음

  try {
    const token = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_VAPID_KEY,
    })
    if (token) {
      console.log('FCM Token:', token)
    } else {
      console.warn(
        '등록된 Firebase 토큰이 없습니다. 권한을 요청해 토큰을 생성하세요.',
      )
    }
  } catch (error) {
    console.error('토큰을 가져오는 중 오류가 발생했습니다. ', error)
  }
}

// 메시지 수신 대기
export const onMessageListener = (): Promise<MessagePayload> =>
  new Promise((resolve, reject) => {
    if (!messaging) {
      console.warn('서버에서 메시징이 초기화되지 않았습니다.')
      reject(new Error('서버에서 메시징이 초기화되지 않았습니다.'))
      return
    }

    onMessage(messaging, (payload: MessagePayload) => {
      resolve(payload)
    })
  })
