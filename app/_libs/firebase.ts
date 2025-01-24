import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getMessaging } from 'firebase/messaging'
import { firebaseConfig } from './firebaseConfig'

// Firebase 초기화
const app = initializeApp(firebaseConfig)

// Firebase 서비스 객체 생성
export const auth = getAuth(app)
export const db = getFirestore(app)
export const messaging = getMessaging(app)
