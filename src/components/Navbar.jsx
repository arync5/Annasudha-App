import { useState } from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { useScrolled } from '../hooks/useScrolled'
import { useAuth } from '../context/AuthContext'
import styles from './Navbar.module.css'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const scrolled = useScrolled(50)
  const { isAdmin, logout } = useAuth()
  const navigate = useNavigate()

  const publicLinks = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/programs', label: 'Programs' },
    { to: '/volunteer', label: 'Volunteer' },
    { to: '/contact', label: 'Contact' },
  ]

  function handleLogout() {
    setOpen(false)
    logout()
    navigate('/')
  }

  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.inner}>
        <Link to="/" className={styles.logo} onClick={() => setOpen(false)}>
          <span className={styles.diamond}>◆</span> Anna Seva
        </Link>

        <button
          className={styles.toggle}
          aria-label="Toggle menu"
          onClick={() => setOpen(o => !o)}
        >
          {open ? '✕' : '☰'}
        </button>

        <ul className={`${styles.links} ${open ? styles.linksOpen : ''}`}>
          {publicLinks.map(({ to, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  isActive ? `${styles.link} ${styles.active}` : styles.link
                }
                onClick={() => setOpen(false)}
              >
                {label}
              </NavLink>
            </li>
          ))}

          {isAdmin && (
            <li>
              <NavLink
                to="/inventory"
                className={({ isActive }) =>
                  isActive ? `${styles.link} ${styles.active}` : styles.link
                }
                onClick={() => setOpen(false)}
              >
                📦 Inventory
              </NavLink>
            </li>
          )}

          <li>
            <Link to="/donate" className={styles.donateBtn} onClick={() => setOpen(false)}>
              Donate
            </Link>
          </li>

          {isAdmin && (
            <li>
              <button className={styles.logoutBtn} onClick={handleLogout}>
                Sign Out
              </button>
            </li>
          )}
        </ul>
      </div>
    </nav>
  )
}
