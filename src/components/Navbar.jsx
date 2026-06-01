import { useState } from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { Menu, X, Package, Users, User } from 'lucide-react'
import { useScrolled } from '../hooks/useScrolled'
import { useAuth } from '../context/AuthContext'
import styles from './Navbar.module.css'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const scrolled = useScrolled(50)
  const { isAdmin, isVolunteer, user, logout } = useAuth()
  const navigate = useNavigate()

  const publicLinks = [
    { to: '/',          label: 'Home' },
    { to: '/about',     label: 'About' },
    { to: '/programs',  label: 'Programs' },
    { to: '/volunteer', label: 'Volunteer' },
    { to: '/contact',   label: 'Contact' },
  ]

  async function handleLogout() {
    setOpen(false)
    await logout()
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
          {open ? <X size={20} /> : <Menu size={20} />}
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

          {/* Admin-only links */}
          {isAdmin && (
            <>
              <li>
                <NavLink
                  to="/inventory"
                  className={({ isActive }) =>
                    isActive ? `${styles.link} ${styles.active}` : styles.link
                  }
                  style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                  onClick={() => setOpen(false)}
                >
                  <Package size={15} /> Inventory
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/admin/volunteers"
                  className={({ isActive }) =>
                    isActive ? `${styles.link} ${styles.active}` : styles.link
                  }
                  style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                  onClick={() => setOpen(false)}
                >
                  <Users size={15} /> Applicants
                </NavLink>
              </li>
            </>
          )}

          {/* Volunteer-only: My Portal */}
          {isVolunteer && (
            <li>
              <NavLink
                to="/portal"
                className={({ isActive }) =>
                  isActive ? `${styles.link} ${styles.active}` : styles.link
                }
                style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                onClick={() => setOpen(false)}
              >
                <User size={15} /> My Portal
              </NavLink>
            </li>
          )}

          <li>
            <Link to="/donate" className={styles.donateBtn} onClick={() => setOpen(false)}>
              Donate
            </Link>
          </li>

          {/* Signed-in indicator + logout */}
          {(isAdmin || isVolunteer) && (
            <li className={styles.userMenu}>
              <span className={styles.userName}>{user?.name?.split(' ')[0]}</span>
              <button className={styles.logoutBtn} onClick={handleLogout}>
                Sign Out
              </button>
            </li>
          )}

          {/* Sign-in links for guests */}
          {!isAdmin && !isVolunteer && (
            <li>
              <Link to="/portal/login" className={styles.signinBtn} onClick={() => setOpen(false)}>
                Volunteer Sign In
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  )
}
