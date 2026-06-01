import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import styles from './Login.module.css'

const ADMIN_PASSKEY = import.meta.env.VITE_ADMIN_PASSKEY

export default function AdminSignUp() {
  const { registerAdmin } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const prev = document.body.style.background
    document.body.style.background = 'linear-gradient(150deg, #fdf4f6 0%, #fef9f0 50%, #f5f0fd 100%)'
    return () => { document.body.style.background = prev }
  }, [])

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [passkey, setPasskey] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!name.trim())                   return setError('Please enter your name.')
    if (!/\S+@\S+\.\S+/.test(email))   return setError('Please enter a valid email.')
    if (password.length < 6)           return setError('Password must be at least 6 characters.')
    if (password !== confirm)          return setError('Passwords do not match.')
    if (passkey !== ADMIN_PASSKEY)     return setError('Incorrect admin passkey.')

    setLoading(true)
    const result = await registerAdmin(name, email, password)

    if (!result.ok) {
      setError(result.error)
      setLoading(false)
      return
    }

    navigate('/inventory', { replace: true })
  }

  return (
    <section className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logoRow}>
          <span className={styles.diamond}>◆</span>
          <span className={styles.logoText}>Anna Seva</span>
        </div>

        <h1 className={styles.title}>Create Admin Account</h1>
        <p className={styles.sub}>A valid admin passkey is required to register.</p>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="name">Full Name</label>
            <input
              id="name"
              className={styles.input}
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Jane Doe"
              autoFocus
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="email">Email</label>
            <input
              id="email"
              className={styles.input}
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="jane@example.com"
              autoComplete="email"
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="password">
              Password <span className={styles.hint}>(min. 6 characters)</span>
            </label>
            <input
              id="password"
              className={styles.input}
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="confirm">Confirm Password</label>
            <input
              id="confirm"
              className={styles.input}
              type="password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              autoComplete="new-password"
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="passkey">Admin Passkey</label>
            <input
              id="passkey"
              className={styles.input}
              type="password"
              value={passkey}
              onChange={e => setPasskey(e.target.value)}
              placeholder="Enter admin passkey"
              autoComplete="off"
              required
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button
            className={styles.btn}
            type="submit"
            disabled={loading || !name || !email || !password || !confirm || !passkey}
          >
            {loading ? 'Creating account…' : 'Create Admin Account'}
          </button>
        </form>

        <div className={styles.divider} />

        <Link to="/admin/login" className={styles.signupBtn}>
          Back to Sign In
        </Link>

        <p className={styles.note}>
          This portal is for Anna Seva staff only. If you need access, contact your administrator.
        </p>
      </div>
    </section>
  )
}
