import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as fbSignOut,
} from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { auth, db } from '../firebase'

const AuthContext = createContext(null)

function friendlyError(code) {
  switch (code) {
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':  return 'Invalid email or password.'
    case 'auth/email-already-in-use': return 'An account with this email already exists.'
    case 'auth/weak-password':        return 'Password must be at least 6 characters.'
    case 'auth/invalid-email':        return 'Please enter a valid email address.'
    case 'auth/too-many-requests':    return 'Too many attempts. Please try again later.'
    default:                          return 'Something went wrong. Please try again.'
  }
}

export function AuthProvider({ children }) {
  // user shape: { uid, name, email, role: 'admin'|'volunteer' } | null
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true) // true while Firebase initialises

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        const snap = await getDoc(doc(db, 'users', fbUser.uid))
        setUser(snap.exists() ? { uid: fbUser.uid, ...snap.data() } : null)
      } else {
        setUser(null)
      }
      setLoading(false)
    })
    return unsub
  }, [])

  const isAdmin     = user?.role === 'admin'
  const isVolunteer = user?.role === 'volunteer'

  // ── Sign in (works for both roles) ────────────────────────────────────────
  // Returns { ok: true, role } or { ok: false, error }
  const signIn = useCallback(async (email, password) => {
    try {
      const cred = await signInWithEmailAndPassword(auth, email.trim(), password)
      const snap = await getDoc(doc(db, 'users', cred.user.uid))
      if (!snap.exists()) {
        await fbSignOut(auth)
        return { ok: false, error: 'No profile found for this account. Contact an administrator.' }
      }
      return { ok: true, role: snap.data().role }
    } catch (err) {
      return { ok: false, error: friendlyError(err.code) }
    }
  }, [])

  // ── Register a new volunteer ──────────────────────────────────────────────
  const registerVolunteer = useCallback(async (name, email, password) => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), password)
      await setDoc(doc(db, 'users', cred.user.uid), {
        name:  name.trim(),
        email: email.trim().toLowerCase(),
        role:  'volunteer',
      })
      return { ok: true }
    } catch (err) {
      return { ok: false, error: friendlyError(err.code) }
    }
  }, [])

  // ── Register a new admin ──────────────────────────────────────────────────
  const registerAdmin = useCallback(async (name, email, password) => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), password)
      await setDoc(doc(db, 'users', cred.user.uid), {
        name:  name.trim(),
        email: email.trim().toLowerCase(),
        role:  'admin',
      })
      return { ok: true }
    } catch (err) {
      return { ok: false, error: friendlyError(err.code) }
    }
  }, [])

  // ── Sign out ──────────────────────────────────────────────────────────────
  const logout = useCallback(async () => {
    await fbSignOut(auth)
  }, [])

  return (
    <AuthContext.Provider value={{
      user, isAdmin, isVolunteer, loading,
      signIn, registerVolunteer, registerAdmin, logout,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
