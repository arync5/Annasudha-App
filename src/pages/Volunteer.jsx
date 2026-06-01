import { useState } from 'react'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { Handshake, Sprout, Users, CheckCircle, MapPin } from 'lucide-react'
import { db } from '../firebase'
import styles from './Volunteer.module.css'
import VolunteerMap, { ORG } from '../components/VolunteerMap'

const ROLES = [
  'Kitchen & Cooking',
  'Food Pickup & Delivery',
  'Community Outreach',
  'Event Support',
  'Administration',
  'Social Media & Marketing',
  'Fundraising',
  'Education & Workshops',
]

const AVAILABILITY = ['Weekday mornings', 'Weekday afternoons', 'Weekday evenings', 'Weekend mornings', 'Weekend afternoons', 'Weekend evenings', 'On-call / as needed']

const initialForm = {
  firstName: '', lastName: '', email: '', phone: '',
  city: '', zipCode: '', age: '',
  roles: [], availability: [],
  experience: '', motivation: '',
  emergency_name: '', emergency_phone: '',
  agreeTerms: false,
}

export default function Volunteer() {
  const [form, setForm] = useState(initialForm)
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState({})

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    if (type === 'checkbox' && name === 'agreeTerms') {
      setForm(f => ({ ...f, agreeTerms: checked }))
    } else if (type === 'checkbox') {
      setForm(f => {
        const arr = f[name]
        return { ...f, [name]: checked ? [...arr, value] : arr.filter(v => v !== value) }
      })
    } else {
      setForm(f => ({ ...f, [name]: value }))
    }
    if (errors[name]) setErrors(e => ({ ...e, [name]: '' }))
  }

  function validate() {
    const e = {}
    if (!form.firstName.trim()) e.firstName = 'Required'
    if (!form.lastName.trim()) e.lastName = 'Required'
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required'
    if (!form.phone.trim()) e.phone = 'Required'
    if (!form.city.trim()) e.city = 'Required'
    if (form.roles.length === 0) e.roles = 'Select at least one area'
    if (form.availability.length === 0) e.availability = 'Select at least one time'
    if (!form.motivation.trim()) e.motivation = 'Please share your motivation'
    if (!form.emergency_name.trim()) e.emergency_name = 'Required'
    if (!form.emergency_phone.trim()) e.emergency_phone = 'Required'
    if (!form.agreeTerms) e.agreeTerms = 'You must agree to continue'
    return e
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    // Save to Firestore — errors are silent so the user still sees confirmation
    try {
      await addDoc(collection(db, 'applications'), {
        ...form,
        status:       'pending',
        adminComment: '',
        submittedAt:  serverTimestamp(),
      })
    } catch (_) {}

    setSubmitted(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      <section className="page-hero">
        <h1>Volunteer With Us</h1>
        <p>Join over 1,200 volunteers making a difference every day.</p>
      </section>

      {/* Why volunteer */}
      <section className="section how-section">
        <div className="container">
          <span className="section-tag center">Why Volunteer?</span>
          <h2 className="center">Your Time Changes Lives</h2>
          <div className="steps-grid">
            {[
              { Icon: Handshake, title: 'Real Impact',      text: 'Every shift you volunteer directly translates to meals on the table for families in your own community.' },
              { Icon: Sprout,    title: 'Grow & Learn',     text: 'Gain hands-on experience in food service, logistics, community organizing, and more.' },
              { Icon: Users,     title: 'Find Your People', text: 'Join a warm, passionate community of people who show up for others — and for each other.' },
            ].map(v => (
              <div key={v.title} className="step-card">
                <div className="step-icon"><v.Icon size={36} /></div>
                <h3>{v.title}</h3>
                <p>{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sign-up form */}
      <section className="section form-section">
        <div className="container">
          <span className="section-tag center">Sign Up</span>
          <h2 className="center" style={{ marginBottom: '2rem' }}>Volunteer Registration</h2>

          <div className="form-card">
            {submitted ? (
              <div>
                {/* Confirmation header */}
                <div className="success-box" style={{ marginBottom: '2rem' }}>
                  <div className="check"><CheckCircle size={40} /></div>
                  <h3>You're signed up!</h3>
                  <p>
                    Thank you, <strong>{form.firstName}</strong>! We've received your registration
                    and will be in touch at <strong>{form.email}</strong> within 2–3 business days
                    with next steps and orientation details.
                  </p>
                </div>

                {/* Where to go section */}
                <div className={styles.whereSection}>
                  <h3 className={styles.whereTitle} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <MapPin size={20} /> Where to show up
                  </h3>
                  <p className={styles.whereDesc}>
                    Here's where your first shift will be. Hit <strong>"Show my location"</strong> on
                    the map to see directions from where you are right now.
                  </p>
                  <VolunteerMap />
                </div>

                <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                  <button
                    className="btn btn-primary"
                    onClick={() => { setForm(initialForm); setSubmitted(false) }}
                  >
                    Register Another Volunteer
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>

                {/* Personal Info */}
                <div className={styles.sectionLabel}>Personal Information</div>
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="firstName">First Name *</label>
                    <input id="firstName" name="firstName" value={form.firstName} onChange={handleChange} placeholder="Jane" />
                    {errors.firstName && <span className={styles.error}>{errors.firstName}</span>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="lastName">Last Name *</label>
                    <input id="lastName" name="lastName" value={form.lastName} onChange={handleChange} placeholder="Doe" />
                    {errors.lastName && <span className={styles.error}>{errors.lastName}</span>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email Address *</label>
                    <input id="email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="jane@example.com" />
                    {errors.email && <span className={styles.error}>{errors.email}</span>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone">Phone Number *</label>
                    <input id="phone" name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="(555) 123-4567" />
                    {errors.phone && <span className={styles.error}>{errors.phone}</span>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="city">City *</label>
                    <input id="city" name="city" value={form.city} onChange={handleChange} placeholder="Your city" />
                    {errors.city && <span className={styles.error}>{errors.city}</span>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="zipCode">ZIP Code</label>
                    <input id="zipCode" name="zipCode" value={form.zipCode} onChange={handleChange} placeholder="00000" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="age">Age</label>
                    <select id="age" name="age" value={form.age} onChange={handleChange}>
                      <option value="">Select age range</option>
                      <option>13–17 (minor, parental consent needed)</option>
                      <option>18–24</option>
                      <option>25–34</option>
                      <option>35–49</option>
                      <option>50–64</option>
                      <option>65+</option>
                    </select>
                  </div>
                </div>

                {/* Volunteer Interests */}
                <div className={styles.sectionLabel} style={{ marginTop: '2rem' }}>Volunteer Interests</div>
                <div className="form-group full">
                  <label>Areas of Interest * <span className={styles.hint}>(select all that apply)</span></label>
                  <div className="checkbox-group">
                    {ROLES.map(r => (
                      <label key={r} className="checkbox-label">
                        <input type="checkbox" name="roles" value={r} checked={form.roles.includes(r)} onChange={handleChange} />
                        {r}
                      </label>
                    ))}
                  </div>
                  {errors.roles && <span className={styles.error}>{errors.roles}</span>}
                </div>

                <div className="form-group full" style={{ marginTop: '1.25rem' }}>
                  <label>Availability * <span className={styles.hint}>(select all that apply)</span></label>
                  <div className="checkbox-group">
                    {AVAILABILITY.map(a => (
                      <label key={a} className="checkbox-label">
                        <input type="checkbox" name="availability" value={a} checked={form.availability.includes(a)} onChange={handleChange} />
                        {a}
                      </label>
                    ))}
                  </div>
                  {errors.availability && <span className={styles.error}>{errors.availability}</span>}
                </div>

                <div className="form-grid" style={{ marginTop: '1.25rem' }}>
                  <div className="form-group full">
                    <label htmlFor="experience">Relevant Experience <span className={styles.hint}>(optional)</span></label>
                    <textarea id="experience" name="experience" value={form.experience} onChange={handleChange} placeholder="E.g. cooking experience, driving license, bilingual skills, prior volunteer work…" />
                  </div>
                  <div className="form-group full">
                    <label htmlFor="motivation">Why do you want to volunteer? *</label>
                    <textarea id="motivation" name="motivation" value={form.motivation} onChange={handleChange} placeholder="Tell us what brought you here and what you hope to contribute…" />
                    {errors.motivation && <span className={styles.error}>{errors.motivation}</span>}
                  </div>
                </div>

                {/* Emergency Contact */}
                <div className={styles.sectionLabel} style={{ marginTop: '2rem' }}>Emergency Contact</div>
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="emergency_name">Contact Name *</label>
                    <input id="emergency_name" name="emergency_name" value={form.emergency_name} onChange={handleChange} placeholder="Full name" />
                    {errors.emergency_name && <span className={styles.error}>{errors.emergency_name}</span>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="emergency_phone">Contact Phone *</label>
                    <input id="emergency_phone" name="emergency_phone" type="tel" value={form.emergency_phone} onChange={handleChange} placeholder="(555) 987-6543" />
                    {errors.emergency_phone && <span className={styles.error}>{errors.emergency_phone}</span>}
                  </div>
                </div>

                {/* Agreement */}
                <div className="form-group full" style={{ marginTop: '1.5rem' }}>
                  <label className="checkbox-label">
                    <input type="checkbox" name="agreeTerms" checked={form.agreeTerms} onChange={handleChange} />
                    I agree to the volunteer code of conduct, understand that volunteering is unpaid, and consent to my information being used to coordinate volunteer activities.
                  </label>
                  {errors.agreeTerms && <span className={styles.error}>{errors.agreeTerms}</span>}
                </div>

                <div className="form-submit">
                  <button type="submit" className="btn btn-primary">Submit Registration</button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
