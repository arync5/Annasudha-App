import { createContext, useContext, useState, useCallback } from 'react'

const AuthContext = createContext(null)

// Admin credentials — change as needed
const ADMIN_USERNAME = 'admin'
const ADMIN_PASSWORD = 'annaseva2024'

const SESSION_KEY   = 'annaseva_session'
const VOLUNTEERS_KEY = 'annaseva_volunteers'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const s = sessionStorage.getItem(SESSION_KEY)
      return s ? JSON.parse(s) : null
    } catch { return null }
  })

  const isAdmin     = user?.role === 'admin'
  const isVolunteer = user?.role === 'volunteer'

  // ── Admin ──────────────────────────────────────────────────────────────
  const adminLogin = useCallback((username, password) => {
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      const u = { role: 'admin', name: 'Administrator' }
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(u))
      setUser(u)
      return { ok: true }
    }
    return { ok: false, error: 'Invalid username or password.' }
  }, [])

  // ── Volunteer ──────────────────────────────────────────────────────────
  const registerVolunteer = useCallback((name, email, password) => {
    const volunteers = JSON.parse(localStorage.getItem(VOLUNTEERS_KEY) || '{}')
    const key = email.trim().toLowerCase()
    if (volunteers[key]) return { ok: false, error: 'An account with this email already exists.' }
    volunteers[key] = { name: name.trim(), email: key, password }
    localStorage.setItem(VOLUNTEERS_KEY, JSON.stringify(volunteers))
    const u = { role: 'volunteer', name: name.trim(), email: key }
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(u))
    setUser(u)
    return { ok: true }
  }, [])

  const volunteerLogin = useCallback((email, password) => {
    const volunteers = JSON.parse(localStorage.getItem(VOLUNTEERS_KEY) || '{}')
    const key = email.trim().toLowerCase()
    const acc = volunteers[key]
    if (!acc || acc.password !== password) return { ok: false, error: 'Invalid email or password.' }
    const u = { role: 'volunteer', name: acc.name, email: key }
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(u))
    setUser(u)
    return { ok: true }
  }, [])

  // ── Shared ─────────────────────────────────────────────────────────────
  const logout = useCallback(() => {
    sessionStorage.removeItem(SESSION_KEY)
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{
      user, isAdmin, isVolunteer,
      adminLogin, registerVolunteer, volunteerLogin, logout,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
