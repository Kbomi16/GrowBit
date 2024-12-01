// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
// import { getAnalytics } from 'firebase/analytics'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyA2i-C8ncVPBT0n9suHynuA9mgj_fWjSts',
  authDomain: 'growbit-1ac73.firebaseapp.com',
  projectId: 'growbit-1ac73',
  storageBucket: 'growbit-1ac73.firebasestorage.app',
  messagingSenderId: '819391634564',
  appId: '1:819391634564:web:961e0d7541041ff8f476d1',
  measurementId: 'G-3TD7ND6X0R',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
// const analytics = getAnalytics(app)
export const auth = getAuth(app)
export const db = getFirestore(app)
