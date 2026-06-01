import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import styles from './VolunteerPortal.module.css'

export default function VolunteerPortal() {
  const { signIn, registerVolunteer } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/portal'

  const [tab, setTab] = useState('signin')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Sign-in fields
  const [siEmail, setSiEmail] = useState('')
  const [siPassword, setSiPassword] = useState('')

  // Register fields
  const [regName, setRegName] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [regConfirm, setRegConfirm] = useState('')

  async function handleSignIn(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await signIn(siEmail, siPassword)

    if (!result.ok) {
      setError(result.error)
      setLoading(false)
      return
    }

    navigate(from, { replace: true })
  }

  async function handleRegister(e) {
    e.preventDefault()
    setError('')
    if (!regName.trim())                     return setError('Please enter your name.')
    if (!/\S+@\S+\.\S+/.test(regEmail))      return setError('Please enter a valid email.')
    if (regPassword.length < 6)              return setError('Password must be at least 6 characters.')
    if (regPassword !== regConfirm)          return setError('Passwords do not match.')

    setLoading(true)
    const result = await registerVolunteer(regName, regEmail, regPassword)

    if (!result.ok) {
      setError(result.error)
      setLoading(false)
      return
    }

    navigate('/portal', { replace: true })
  }

  function switchTab(t) {
    setTab(t)
    setError('')
  }

  return (
    <section className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logoRow}>
          <span className={styles.diamond}>◆</span>
          <span className={styles.logoText}>Anna Seva</span>
        </div>

        <h1 className={styles.title}>Volunteer Portal</h1>
        <p className={styles.sub}>Sign in to manage your shifts and track your impact.</p>

        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${tab === 'signin' ? styles.tabActive : ''}`}
            onClick={() => switchTab('signin')}
            type="button"
          >
            Sign In
          </button>
          <button
            className={`${styles.tab} ${tab === 'register' ? styles.tabActive : ''}`}
            onClick={() => switchTab('register')}
            type="button"
          >
            Create Account
          </button>
        </div>

        {error && <p className={styles.error}>{error}</p>}

        {tab === 'signin' ? (
          <form className={styles.form} onSubmit={handleSignIn} noValidate>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="si-email">Email</label>
              <input
                id="si-email"
                className={styles.input}
                type="email"
                value={siEmail}
                onChange={e => setSiEmail(e.target.value)}
                autoComplete="email"
                autoFocus
                required
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="si-password">Password</label>
              <input
                id="si-password"
                className={styles.input}
                type="password"
                value={siPassword}
                onChange={e => setSiPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>
            <button
              className={styles.btn}
              type="submit"
              disabled={loading || !siEmail || !siPassword}
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
            <p className={styles.switchHint}>
              No account yet?{' '}
              <button type="button" className={styles.switchLink} onClick={() => switchTab('register')}>
                Create one →
              </button>
            </p>
          </form>
        ) : (
          <form className={styles.form} onSubmit={handleRegister} noValidate>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="reg-name">Full Name</label>
              <input
                id="reg-name"
                className={styles.input}
                type="text"
                value={regName}
                onChange={e => setRegName(e.target.value)}
                placeholder="Jane Doe"
                autoFocus
                required
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="reg-email">Email</label>
              <input
                id="reg-email"
                className={styles.input}
                type="email"
                value={regEmail}
                onChange={e => setRegEmail(e.target.value)}
                placeholder="jane@example.com"
                autoComplete="email"
                required
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="reg-password">
                Password <span className={styles.hint}>(min. 6 characters)</span>
              </label>
              <input
                id="reg-password"
                className={styles.input}
                type="password"
                value={regPassword}
                onChange={e => setRegPassword(e.target.value)}
                autoComplete="new-password"
                required
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="reg-confirm">Confirm Password</label>
              <input
                id="reg-confirm"
                className={styles.input}
                type="password"
                value={regConfirm}
                onChange={e => setRegConfirm(e.target.value)}
                autoComplete="new-password"
                required
              />
            </div>
            <button
              className={styles.btn}
              type="submit"
              disabled={loading || !regName || !regEmail || !regPassword || !regConfirm}
            >
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
            <p className={styles.switchHint}>
              Already have an account?{' '}
              <button type="button" className={styles.switchLink} onClick={() => switchTab('signin')}>
                Sign in →
              </button>
            </p>
          </form>
        )}

        <p className={styles.note}>
          Want to learn more first?{' '}
          <Link to="/volunteer" className={styles.noteLink}>See how volunteering works</Link>
        </p>
      </div>
    </section>
  )
}
