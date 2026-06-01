import { useState, useMemo } from 'react'
import { Utensils, Truck, Leaf, Home, BookOpen, Zap, Calendar, ClipboardList, User, Clock, MapPin, Timer, Check } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import styles from './VolunteerDashboard.module.css'

// ── Upcoming shifts catalogue ─────────────────────────────────────────────────
const ALL_SHIFTS = [
  { id: 1,  program: 'Community Kitchen',    Icon: Utensils, date: '2026-05-02', day: 'Saturday',  time: '10am – 2pm',  location: 'Main Kitchen, San Jose',        hours: 4 },
  { id: 2,  program: 'Community Kitchen',    Icon: Utensils, date: '2026-05-03', day: 'Sunday',    time: '10am – 2pm',  location: 'Main Kitchen, San Jose',        hours: 4 },
  { id: 3,  program: 'Food Rescue',          Icon: Truck,    date: '2026-05-05', day: 'Monday',    time: '8am – 11am',  location: 'Various pickup sites',          hours: 3 },
  { id: 4,  program: 'School Nutrition',     Icon: Leaf,     date: '2026-05-08', day: 'Friday',    time: '7am – 9am',   location: 'Lincoln Elementary, Milpitas',  hours: 2 },
  { id: 5,  program: 'Community Kitchen',    Icon: Utensils, date: '2026-05-09', day: 'Saturday',  time: '10am – 2pm',  location: 'Eastside Center, San Jose',     hours: 4 },
  { id: 6,  program: 'Food Rescue',          Icon: Truck,    date: '2026-05-12', day: 'Tuesday',   time: '8am – 11am',  location: 'Various pickup sites',          hours: 3 },
  { id: 7,  program: 'Family Pantry',        Icon: Home,     date: '2026-05-17', day: 'Saturday',  time: '9am – 1pm',   location: 'Community Center, Milpitas',    hours: 4 },
  { id: 8,  program: 'Nutrition Education',  Icon: BookOpen, date: '2026-05-19', day: 'Tuesday',   time: '6pm – 8:30pm',location: 'Library Hall, Sunnyvale',       hours: 2.5 },
  { id: 9,  program: 'Community Kitchen',    Icon: Utensils, date: '2026-05-23', day: 'Saturday',  time: '10am – 2pm',  location: 'Main Kitchen, San Jose',        hours: 4 },
  { id: 10, program: 'Crisis Response Drill',Icon: Zap,      date: '2026-05-28', day: 'Thursday',  time: '9am – 12pm',  location: 'HQ, San Jose',                  hours: 3 },
  { id: 11, program: 'Food Rescue',          Icon: Truck,    date: '2026-06-02', day: 'Tuesday',   time: '8am – 11am',  location: 'Various pickup sites',          hours: 3 },
  { id: 12, program: 'Family Pantry',        Icon: Home,     date: '2026-06-07', day: 'Saturday',  time: '9am – 1pm',   location: 'Community Center, Milpitas',    hours: 4 },
]

const SIGNUPS_KEY = 'annaseva_volunteer_signups'

function loadSignups(email) {
  try {
    const all = JSON.parse(localStorage.getItem(SIGNUPS_KEY) || '{}')
    return new Set(all[email] || [])
  } catch { return new Set() }
}

function saveSignups(email, set) {
  try {
    const all = JSON.parse(localStorage.getItem(SIGNUPS_KEY) || '{}')
    all[email] = [...set]
    localStorage.setItem(SIGNUPS_KEY, JSON.stringify(all))
  } catch {}
}

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const TODAY = '2026-04-23'

export default function VolunteerDashboard() {
  const { user } = useAuth()
  const email = user?.email || ''

  const [signups, setSignups] = useState(() => loadSignups(email))
  const [activeTab, setActiveTab] = useState('upcoming') // 'upcoming' | 'my-shifts' | 'profile'
  const [filter, setFilter] = useState('All')

  const programs = useMemo(() => ['All', ...new Set(ALL_SHIFTS.map(s => s.program))], [])

  const filteredShifts = useMemo(() => {
    return ALL_SHIFTS.filter(s =>
      s.date >= TODAY && (filter === 'All' || s.program === filter)
    )
  }, [filter])

  const myShifts = useMemo(() => {
    return ALL_SHIFTS.filter(s => signups.has(s.id)).sort((a, b) => a.date.localeCompare(b.date))
  }, [signups])

  const myUpcoming = myShifts.filter(s => s.date >= TODAY)
  const myPast     = myShifts.filter(s => s.date < TODAY)
  const totalHours = myShifts.reduce((n, s) => n + s.hours, 0)

  function toggle(id) {
    setSignups(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      saveSignups(email, next)
      return next
    })
  }

  return (
    <div className={styles.page}>
      {/* ── Header ── */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Welcome back, {user?.name?.split(' ')[0]}!</h1>
          <p className={styles.sub}>Here's your volunteer dashboard.</p>
        </div>
        <div className={styles.statRow}>
          <div className={styles.stat}>
            <span className={styles.statNum}>{myUpcoming.length}</span>
            <span className={styles.statLabel}>Upcoming shifts</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.stat}>
            <span className={styles.statNum}>{totalHours}</span>
            <span className={styles.statLabel}>Total hours</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.stat}>
            <span className={styles.statNum}>{myPast.length}</span>
            <span className={styles.statLabel}>Shifts completed</span>
          </div>
        </div>
      </div>

      {/* ── Tab bar ── */}
      <div className={styles.tabBar}>
        {[
          { key: 'upcoming',  label: 'Find Shifts',                                                          Icon: Calendar      },
          { key: 'my-shifts', label: `My Shifts${myUpcoming.length ? ` (${myUpcoming.length})` : ''}`,       Icon: ClipboardList },
          { key: 'profile',   label: 'Profile',                                                               Icon: User          },
        ].map(t => (
          <button
            key={t.key}
            className={`${styles.tabBtn} ${activeTab === t.key ? styles.tabBtnActive : ''}`}
            onClick={() => setActiveTab(t.key)}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <t.Icon size={15} /> {t.label}
          </button>
        ))}
      </div>

      {/* ── Find Shifts ── */}
      {activeTab === 'upcoming' && (
        <div className={styles.panel}>
          <div className={styles.filterRow}>
            <span className={styles.filterLabel}>Filter by program:</span>
            <div className={styles.chips}>
              {programs.map(p => (
                <button
                  key={p}
                  className={`${styles.chip} ${filter === p ? styles.chipActive : ''}`}
                  onClick={() => setFilter(p)}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.shiftGrid}>
            {filteredShifts.length === 0 && (
              <p className={styles.empty}>No upcoming shifts for this program yet.</p>
            )}
            {filteredShifts.map(shift => {
              const signed = signups.has(shift.id)
              return (
                <div key={shift.id} className={`${styles.shiftCard} ${signed ? styles.shiftCardSigned : ''}`}>
                  <div className={styles.shiftTop}>
                    <span className={styles.shiftIcon}><shift.Icon size={20} /></span>
                    <div className={styles.shiftMeta}>
                      <span className={styles.shiftProgram}>{shift.program}</span>
                      <span className={styles.shiftDate}>{shift.day}, {formatDate(shift.date)}</span>
                    </div>
                    {signed && <span className={styles.signedBadge} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>Signed Up <Check size={13} /></span>}
                  </div>
                  <div className={styles.shiftDetails}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Clock size={13} /> {shift.time}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><MapPin size={13} /> {shift.location}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Timer size={13} /> {shift.hours}h</span>
                  </div>
                  <button
                    className={signed ? styles.btnCancel : styles.btnSignUp}
                    onClick={() => toggle(shift.id)}
                  >
                    {signed ? 'Cancel sign-up' : 'Sign up for this shift'}
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ── My Shifts ── */}
      {activeTab === 'my-shifts' && (
        <div className={styles.panel}>
          {myShifts.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}><Calendar size={48} /></div>
              <h3>No shifts yet</h3>
              <p>Head over to "Find Shifts" to sign up for your first shift!</p>
              <button className={styles.btnPrimary} onClick={() => setActiveTab('upcoming')}>
                Browse Available Shifts
              </button>
            </div>
          ) : (
            <>
              {myUpcoming.length > 0 && (
                <div className={styles.shiftSection}>
                  <h3 className={styles.shiftSectionTitle}>Upcoming ({myUpcoming.length})</h3>
                  <div className={styles.shiftList}>
                    {myUpcoming.map(shift => (
                      <div key={shift.id} className={styles.shiftRow}>
                        <span className={styles.shiftRowIcon}><shift.Icon size={18} /></span>
                        <div className={styles.shiftRowInfo}>
                          <span className={styles.shiftRowName}>{shift.program}</span>
                          <span className={styles.shiftRowSub}>{shift.day}, {formatDate(shift.date)} · {shift.time} · {shift.location}</span>
                        </div>
                        <span className={styles.shiftRowHours}>{shift.hours}h</span>
                        <button className={styles.btnCancelSm} onClick={() => toggle(shift.id)}>Cancel</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {myPast.length > 0 && (
                <div className={styles.shiftSection} style={{ marginTop: '1.75rem' }}>
                  <h3 className={styles.shiftSectionTitle}>Completed ({myPast.length})</h3>
                  <div className={styles.shiftList}>
                    {myPast.map(shift => (
                      <div key={shift.id} className={`${styles.shiftRow} ${styles.shiftRowPast}`}>
                        <span className={styles.shiftRowIcon}><shift.Icon size={18} /></span>
                        <div className={styles.shiftRowInfo}>
                          <span className={styles.shiftRowName}>{shift.program}</span>
                          <span className={styles.shiftRowSub}>{shift.day}, {formatDate(shift.date)} · {shift.time}</span>
                        </div>
                        <span className={styles.shiftRowHours}>{shift.hours}h</span>
                        <span className={styles.completedTag} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Check size={13} /> Done</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className={styles.hoursSummary}>
                <span>Total volunteered:</span>
                <strong>{totalHours} hours</strong>
              </div>
            </>
          )}
        </div>
      )}

      {/* ── Profile ── */}
      {activeTab === 'profile' && (
        <div className={styles.panel}>
          <div className={styles.profileCard}>
            <div className={styles.avatar}>{user?.name?.charAt(0).toUpperCase()}</div>
            <div className={styles.profileInfo}>
              <h2 className={styles.profileName}>{user?.name}</h2>
              <p className={styles.profileEmail}>{user?.email}</p>
              <span className={styles.roleBadge}>Volunteer</span>
            </div>
          </div>

          <div className={styles.profileStats}>
            <div className={styles.profileStat}>
              <span className={styles.profileStatNum}>{myShifts.length}</span>
              <span className={styles.profileStatLabel}>Total shifts signed up</span>
            </div>
            <div className={styles.profileStat}>
              <span className={styles.profileStatNum}>{myPast.length}</span>
              <span className={styles.profileStatLabel}>Shifts completed</span>
            </div>
            <div className={styles.profileStat}>
              <span className={styles.profileStatNum}>{totalHours}</span>
              <span className={styles.profileStatLabel}>Hours contributed</span>
            </div>
          </div>

          <div className={styles.profileNote}>
            <p>To update your name, email, or password, please contact a site administrator.</p>
          </div>
        </div>
      )}
    </div>
  )
}
