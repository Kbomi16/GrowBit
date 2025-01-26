importScripts(
  'https://www.gstatic.com/firebasejs/9.20.0/firebase-app-compat.js',
)
importScripts(
  'https://www.gstatic.com/firebasejs/9.20.0/firebase-messaging-compat.js',
)

const firebaseConfig = {
  apiKey: 'AIzaSyA2i-C8ncVPBT0n9suHynuA9mgj_fWjSts',
  authDomain: 'growbit-1ac73.firebasePUBLIC.com',
  projectId: 'growbit-1ac73',
  storageBucket: 'growbit-1ac73.firebasestorage.PUBLIC',
  messagingSenderId: '819391634564',
  appId: '1:819391634564:web:961e0d7541041ff8f476d1',
}

firebase.initializeApp(firebaseConfig)
const messaging = firebase.messaging()

messaging.onBackgroundMessage((payload) => {
  console.log('백그라운드 메시지 수신:', payload)
  const title = payload.notification?.title || '알림'
  const body = payload.notification?.body || '새로운 알림이 도착했습니다.'
  const options = {
    body: body,
    icon: '/icons/icon_maskable.png',
    tag: payload.messageId, // messageId를 tag로 사용하여 중복을 방지
  }

  self.registration.showNotification(title, options)
})
