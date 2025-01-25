export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register(
        '/firebase-messaging-sw.js',
      )
      console.log('서비스워커 등록: ', registration)
    } catch (error) {
      console.error('서비스워커 등록 실패: ', error)
    }
  }
}
