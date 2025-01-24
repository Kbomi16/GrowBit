importScripts(
  'https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js',
)
importScripts(
  'https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js',
)

const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_AUTH_DOMAIN',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_STORAGE_BUCKET',
  messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
  appId: 'YOUR_APP_ID',
  measurementId: 'YOUR_MEASUREMENT_ID',
}

firebase.initializeApp(firebaseConfig)

// Firebase Messaging 초기화
const messaging = firebase.messaging()

// 백그라운드 메시지 수신 처리
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] 백그라운드 메시지 수신: ', payload)

  const notificationTitle = payload.notification?.title || '알림 제목'
  const notificationOptions = {
    body: payload.notification?.body || '알림 내용',
    icon: '/icons/icon_maskable.png',
  }

  self.registration.showNotification(notificationTitle, notificationOptions)
})
