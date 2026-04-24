import { useState } from 'react'
import styles from './Volunteer.module.css'

const PRESET_AMOUNTS = [
  { value: 25,  label: 'Feeds 5 people' },
  { value: 50,  label: 'Feeds 10 people' },
  { value: 100, label: 'Feeds a family for a week' },
  { value: 250, label: 'Stocks our pantry for a day' },
]

export default function Donate() {
  const [selected, setSelected] = useState(50)
  const [custom, setCustom] = useState('')
  const [frequency, setFrequency] = useState('one-time')
  const [donated, setDonated] = useState(false)
  const [form, setForm] = useState({ name: '', email: '' })
  const [errors, setErrors] = useState({})

  const amount = custom ? parseFloat(custom) : selected

  function handleSubmit(e) {
    e.preventDefault()
    const errs = {}
    if (!form.name.trim()) errs.name = 'Required'
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Valid email required'
    if (!amount || amount < 1) errs.amount = 'Please select or enter a donation amount'
    if (Object.keys(errs).length) { setErrors(errs); return }
    setDonated(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      <section className="page-hero">
        <h1>Donate</h1>
        <p>Every dollar you give feeds a real person in your community.</p>
      </section>

      {/* Impact bar */}
      <section className="stats-bar">
        <div className="stats-inner">
          {[
            { num: '$5',   label: 'Feeds one person' },
            { num: '$25',  label: 'Feeds a family' },
            { num: '$100', label: 'Stocks the pantry' },
            { num: '$500', label: 'Funds a community kitchen day' },
          ].map(s => (
            <div key={s.label} className="stat">
              <span className="stat-num">{s.num}</span>
              <span className="stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="section form-section">
        <div className="container">
          <span className="section-tag center">Make a Gift</span>
          <h2 className="center" style={{ marginBottom: '2rem' }}>Support Our Mission</h2>

          <div className="form-card">
            {donated ? (
              <div className="success-box">
                <div className="check">💛</div>
                <h3>Thank you, {form.name}!</h3>
                <p>
                  Your {frequency === 'monthly' ? 'monthly ' : ''}gift of{' '}
                  <strong>${amount.toFixed(2)}</strong> will directly support our
                  food programs. A receipt will be emailed to{' '}
                  <strong>{form.email}</strong>.
                </p>
                <p style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Anna Seva is a 501(c)(3) organization. Your donation may be tax-deductible.
                </p>
                <br />
                <button className="btn btn-primary" onClick={() => { setDonated(false); setForm({ name:'', email:'' }) }}>
                  Make Another Donation
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>

                {/* Frequency */}
                <div className={styles.sectionLabel}>Donation Frequency</div>
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                  {['one-time', 'monthly'].map(f => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setFrequency(f)}
                      style={{
                        flex: 1,
                        padding: '0.65rem',
                        borderRadius: 'var(--radius)',
                        border: '2px solid',
                        borderColor: frequency === f ? 'var(--maroon-bright)' : 'rgba(128,0,32,0.2)',
                        background: frequency === f ? 'var(--maroon-bright)' : 'transparent',
                        color: frequency === f ? '#fff' : 'var(--maroon)',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        fontFamily: 'var(--font-sans)',
                      }}
                    >
                      {f === 'one-time' ? 'One-Time' : 'Monthly'}
                    </button>
                  ))}
                </div>

                {/* Amount */}
                <div className={styles.sectionLabel}>Select Amount</div>
                <div className="donate-amounts">
                  {PRESET_AMOUNTS.map(p => (
                    <button
                      key={p.value}
                      type="button"
                      className={`amount-btn ${!custom && selected === p.value ? 'selected' : ''}`}
                      onClick={() => { setSelected(p.value); setCustom('') }}
                    >
                      ${p.value}
                      <span className="amount-label">{p.label}</span>
                    </button>
                  ))}
                </div>
                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                  <label htmlFor="custom">Or enter a custom amount ($)</label>
                  <input
                    id="custom"
                    type="number"
                    min="1"
                    step="1"
                    placeholder="e.g. 75"
                    value={custom}
                    onChange={e => { setCustom(e.target.value); setSelected(null) }}
                  />
                  {errors.amount && <span className={styles.error}>{errors.amount}</span>}
                </div>

                {/* Donor info */}
                <div className={styles.sectionLabel}>Your Information</div>
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="d-name">Full Name *</label>
                    <input id="d-name" name="name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Jane Doe" />
                    {errors.name && <span className={styles.error}>{errors.name}</span>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="d-email">Email Address *</label>
                    <input id="d-email" name="email" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="jane@example.com" />
                    {errors.email && <span className={styles.error}>{errors.email}</span>}
                  </div>
                </div>

                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '1rem', marginBottom: '1.5rem' }}>
                  🔒 This is a demo form — no real payment is processed. Anna Seva is a 501(c)(3) non-profit; donations may be tax-deductible.
                </p>

                <div className="form-submit">
                  <button type="submit" className="btn btn-primary">
                    {frequency === 'monthly' ? `Give $${amount || '?'}/month` : `Donate $${amount || '?'}`}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
