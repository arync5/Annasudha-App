import { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import styles from './Login.module.css'

export default function Login() {
  const { signIn, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/inventory'

  useEffect(() => {
    const prev = document.body.style.background
    document.body.style.background = 'linear-gradient(150deg, #fdf4f6 0%, #fef9f0 50%, #f5f0fd 100%)'
    return () => { document.body.style.background = prev }
  }, [])

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await signIn(email, password)

    if (!result.ok) {
      setError(result.error)
      setLoading(false)
      return
    }

    if (result.role !== 'admin') {
      await logout()
      setError('This account does not have admin access.')
      setLoading(false)
      return
    }

    navigate(from, { replace: true })
  }

  return (
    <section className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logoRow}>
          <span className={styles.diamond}>◆</span>
          <span className={styles.logoText}>Anna Seva</span>
        </div>

        <h1 className={styles.title}>Admin Sign In</h1>
        <p className={styles.sub}>Access is restricted to authorized administrators.</p>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="email">Email</label>
            <input
              id="email"
              className={styles.input}
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="email"
              autoFocus
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="password">Password</label>
            <input
              id="password"
              className={styles.input}
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button
            className={styles.btn}
            type="submit"
            disabled={loading || !email || !password}
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <div className={styles.divider} />

        <Link to="/admin/signup" className={styles.signupBtn}>
          Create Admin Account
        </Link>

        <p className={styles.note}>
          This portal is for Anna Seva staff only. If you need access, contact your administrator.
        </p>
      </div>
    </section>
  )
}
