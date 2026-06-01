import { useState, useEffect, useRef } from 'react'
import {
  collection, onSnapshot, updateDoc, doc, serverTimestamp,
} from 'firebase/firestore'
import { ClipboardList, Clock, CheckCircle, XCircle, MousePointer, RotateCcw } from 'lucide-react'
import { db } from '../firebase'
import styles from './AdminVolunteers.module.css'

// ── Helpers ──────────────────────────────────────────────────────────────────
function formatDate(ts) {
  if (!ts?.seconds) return '—'
  return new Date(ts.seconds * 1000).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })
}

const STATUS_META = {
  pending:     { label: 'Pending',     color: '#b45309', bg: 'rgba(180,83,9,0.08)',   border: 'rgba(180,83,9,0.2)'   },
  approved:    { label: 'Approved',    color: '#15803d', bg: 'rgba(21,128,61,0.08)',   border: 'rgba(21,128,61,0.25)'  },
  disapproved: { label: 'Disapproved', color: '#b03050', bg: 'rgba(176,48,80,0.08)',  border: 'rgba(176,48,80,0.22)' },
}

function StatusBadge({ status }) {
  const m = STATUS_META[status] || STATUS_META.pending
  return (
    <span style={{
      display: 'inline-block',
      background: m.bg,
      color: m.color,
      border: `1px solid ${m.border}`,
      borderRadius: 20,
      fontSize: '0.72rem',
      fontWeight: 700,
      padding: '0.2rem 0.6rem',
      whiteSpace: 'nowrap',
      textTransform: 'capitalize',
    }}>
      {m.label}
    </span>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
export default function AdminVolunteers() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading]           = useState(true)
  const [selected, setSelected]         = useState(null)
  const [filter, setFilter]             = useState('all')
  const [search, setSearch]             = useState('')
  const [comment, setComment]           = useState('')
  const [saving, setSaving]             = useState(false)
  const [saved, setSaved]               = useState(false)
  const detailRef = useRef(null)

  // ── Real-time listener ────────────────────────────────────────────────────
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'applications'), snap => {
      const apps = snap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .sort((a, b) => (b.submittedAt?.seconds || 0) - (a.submittedAt?.seconds || 0))
      setApplications(apps)
      setLoading(false)
      // Keep selected in sync when Firestore updates
      setSelected(prev => prev ? (apps.find(a => a.id === prev.id) ?? prev) : null)
    })
    return unsub
  }, [])

  // ── Derived lists ─────────────────────────────────────────────────────────
  const counts = {
    all:         applications.length,
    pending:     applications.filter(a => a.status === 'pending').length,
    approved:    applications.filter(a => a.status === 'approved').length,
    disapproved: applications.filter(a => a.status === 'disapproved').length,
  }

  const visible = applications.filter(a => {
    if (filter !== 'all' && a.status !== filter) return false
    if (search) {
      const q = search.toLowerCase()
      const name = `${a.firstName} ${a.lastName}`.toLowerCase()
      if (!name.includes(q) && !a.email?.toLowerCase().includes(q) && !a.city?.toLowerCase().includes(q)) return false
    }
    return true
  })

  // ── Actions ───────────────────────────────────────────────────────────────
  async function setStatus(id, status) {
    setSaving(true)
    await updateDoc(doc(db, 'applications', id), { status, updatedAt: serverTimestamp() })
    setSaving(false)
  }

  async function saveComment(id) {
    setSaving(true)
    await updateDoc(doc(db, 'applications', id), {
      adminComment: comment,
      updatedAt: serverTimestamp(),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  function selectApp(app) {
    setSelected(app)
    setComment(app.adminComment || '')
    setSaved(false)
    setTimeout(() => detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className={styles.page}>

      {/* ── Page header ── */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Volunteer Applications</h1>
          <p className={styles.pageSub}>Review, approve, and comment on each submission.</p>
        </div>
      </div>

      {/* ── Stat chips ── */}
      <div className={styles.statRow}>
        {[
          { key: 'all',         label: 'Total',        Icon: ClipboardList },
          { key: 'pending',     label: 'Pending',      Icon: Clock         },
          { key: 'approved',    label: 'Approved',     Icon: CheckCircle   },
          { key: 'disapproved', label: 'Disapproved',  Icon: XCircle       },
        ].map(s => (
          <button
            key={s.key}
            className={`${styles.statChip} ${filter === s.key ? styles.statChipActive : ''}`}
            onClick={() => setFilter(s.key)}
          >
            <span className={styles.statIcon}><s.Icon size={16} /></span>
            <span className={styles.statNum}>{counts[s.key]}</span>
            <span className={styles.statLabel}>{s.label}</span>
          </button>
        ))}
      </div>

      {/* ── Two-panel layout ── */}
      <div className={styles.layout}>

        {/* ── Left: applicant list ── */}
        <div className={styles.listPanel}>
          <div className={styles.listHeader}>
            <input
              className={styles.search}
              type="text"
              placeholder="Search name, email, city…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <span className={styles.listCount}>{visible.length} result{visible.length !== 1 ? 's' : ''}</span>
          </div>

          {loading ? (
            <p className={styles.empty}>Loading…</p>
          ) : visible.length === 0 ? (
            <p className={styles.empty}>No applications match this filter.</p>
          ) : (
            <ul className={styles.list}>
              {visible.map(app => (
                <li
                  key={app.id}
                  className={`${styles.listItem} ${selected?.id === app.id ? styles.listItemActive : ''}`}
                  onClick={() => selectApp(app)}
                >
                  <div className={styles.listItemTop}>
                    <div className={styles.avatar}>
                      {app.firstName?.[0]}{app.lastName?.[0]}
                    </div>
                    <div className={styles.listItemInfo}>
                      <span className={styles.listItemName}>
                        {app.firstName} {app.lastName}
                      </span>
                      <span className={styles.listItemMeta}>{app.email}</span>
                    </div>
                    <StatusBadge status={app.status} />
                  </div>
                  <div className={styles.listItemBottom}>
                    <span>{app.city || '—'}</span>
                    <span>{formatDate(app.submittedAt)}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* ── Right: detail pane ── */}
        <div className={styles.detailPanel} ref={detailRef}>
          {!selected ? (
            <div className={styles.detailEmpty}>
              <span className={styles.detailEmptyIcon}><MousePointer size={40} /></span>
              <p>Select an applicant to review their submission.</p>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className={styles.detailHeader}>
                <div className={styles.detailAvatar}>
                  {selected.firstName?.[0]}{selected.lastName?.[0]}
                </div>
                <div>
                  <h2 className={styles.detailName}>
                    {selected.firstName} {selected.lastName}
                  </h2>
                  <p className={styles.detailMeta}>{selected.email} · {selected.phone}</p>
                  <div style={{ marginTop: '0.4rem' }}>
                    <StatusBadge status={selected.status} />
                  </div>
                </div>
              </div>

              {/* ── Approve / Disapprove ── */}
              <div className={styles.actionRow}>
                <button
                  className={`${styles.actionBtn} ${styles.btnApprove} ${selected.status === 'approved' ? styles.actionBtnActive : ''}`}
                  onClick={() => setStatus(selected.id, 'approved')}
                  disabled={saving || selected.status === 'approved'}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <CheckCircle size={15} /> Approve
                </button>
                <button
                  className={`${styles.actionBtn} ${styles.btnDisapprove} ${selected.status === 'disapproved' ? styles.actionBtnActive : ''}`}
                  onClick={() => setStatus(selected.id, 'disapproved')}
                  disabled={saving || selected.status === 'disapproved'}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <XCircle size={15} /> Disapprove
                </button>
                {selected.status !== 'pending' && (
                  <button
                    className={`${styles.actionBtn} ${styles.btnPending}`}
                    onClick={() => setStatus(selected.id, 'pending')}
                    disabled={saving}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                  >
                    <RotateCcw size={14} /> Reset to Pending
                  </button>
                )}
              </div>

              {/* ── Fields ── */}
              <div className={styles.section}>
                <div className={styles.sectionLabel}>Personal Information</div>
                <div className={styles.fieldGrid}>
                  <Field label="City"      value={selected.city} />
                  <Field label="ZIP"       value={selected.zipCode || '—'} />
                  <Field label="Age"       value={selected.age || '—'} />
                  <Field label="Submitted" value={formatDate(selected.submittedAt)} />
                </div>
              </div>

              <div className={styles.section}>
                <div className={styles.sectionLabel}>Interests &amp; Availability</div>
                <Field label="Areas of Interest" value={selected.roles?.join(', ') || '—'} />
                <Field label="Availability"      value={selected.availability?.join(', ') || '—'} style={{ marginTop: '0.5rem' }} />
              </div>

              {selected.experience && (
                <div className={styles.section}>
                  <div className={styles.sectionLabel}>Relevant Experience</div>
                  <p className={styles.textBlock}>{selected.experience}</p>
                </div>
              )}

              <div className={styles.section}>
                <div className={styles.sectionLabel}>Motivation</div>
                <p className={styles.textBlock}>{selected.motivation || '—'}</p>
              </div>

              <div className={styles.section}>
                <div className={styles.sectionLabel}>Emergency Contact</div>
                <div className={styles.fieldGrid}>
                  <Field label="Name"  value={selected.emergency_name} />
                  <Field label="Phone" value={selected.emergency_phone} />
                </div>
              </div>

              {/* ── Admin comment ── */}
              <div className={styles.section}>
                <div className={styles.sectionLabel}>Admin Comment</div>
                <textarea
                  className={styles.commentBox}
                  value={comment}
                  onChange={e => { setComment(e.target.value); setSaved(false) }}
                  placeholder="Add a private note about this applicant…"
                  rows={3}
                />
                <div className={styles.commentFooter}>
                  {selected.adminComment && comment === selected.adminComment && !saved && (
                    <span className={styles.commentExisting}>Previously saved comment shown above</span>
                  )}
                  {saved && <span className={styles.commentSaved}>✓ Saved</span>}
                  <button
                    className={styles.saveCommentBtn}
                    onClick={() => saveComment(selected.id)}
                    disabled={saving || comment === selected.adminComment}
                  >
                    {saving ? 'Saving…' : 'Save Comment'}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Small field display component ─────────────────────────────────────────────
function Field({ label, value, style }) {
  return (
    <div className={styles.field} style={style}>
      <span className={styles.fieldLabel}>{label}</span>
      <span className={styles.fieldValue}>{value || '—'}</span>
    </div>
  )
}
