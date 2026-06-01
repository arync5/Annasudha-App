import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// ─────────────────────────────────────────────────────────────────────────────
// Replace these values with your Firebase project config.
// Firebase Console → Project Settings → Your apps → SDK setup and config
// ─────────────────────────────────────────────────────────────────────────────
const firebaseConfig = {

  apiKey: "AIzaSyD5j79UwboqSmJOJFu449ZuuH-tMwv5ORo",

  authDomain: "annasudha-website.firebaseapp.com",

  projectId: "annasudha-website",

  storageBucket: "annasudha-website.firebasestorage.app",

  messagingSenderId: "976355514766",

  appId: "1:976355514766:web:5a834425379cb39753ecdf",

  measurementId: "G-H3RLK1SVBZ"

};


const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db   = getFirestore(app)
