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

export const messaging = getMessaging(app)

// 클라이언트에서 푸시 토큰 가져오기
export const requestForToken = async () => {
  try {
    const token = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_VAPID_KEY,
    })
    if (token) {
      console.log('FCM Token:', token)
    } else {
      console.warn(
        'No registration token available. Request permission to generate one.',
      )
    }
  } catch (error) {
    console.error('An error occurred while retrieving token. ', error)
  }
}

// 메시지 수신 대기
export const onMessageListener = (): Promise<MessagePayload> =>
  new Promise((resolve) => {
    onMessage(messaging, (payload: MessagePayload) => {
      resolve(payload)
    })
  })
