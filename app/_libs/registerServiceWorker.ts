export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register(
        '/firebase-messaging-sw.js',
      )
      console.log('Service Worker registered: ', registration)
    } catch (error) {
      console.error('Service Worker registration failed: ', error)
    }
  }
}
