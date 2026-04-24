import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import styles from './Login.module.css'

export default function Login() {
  const { adminLogin: login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/inventory'

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Brief delay for UX feel
    setTimeout(() => {
      const result = login(username.trim(), password)
      if (result.ok) {
        navigate(from, { replace: true })
      } else {
        setError(result.error)
        setLoading(false)
      }
    }, 400)
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
            <label className={styles.label} htmlFor="username">Username</label>
            <input
              id="username"
              className={styles.input}
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              autoComplete="username"
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
            disabled={loading || !username || !password}
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p className={styles.note}>
          This portal is for Anna Seva staff only. If you need access, contact your administrator.
        </p>
      </div>
    </section>
  )
}
