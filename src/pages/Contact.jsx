import { useState } from 'react'
import { Mail, Phone, MapPin, Clock } from 'lucide-react'
import styles from './Volunteer.module.css'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sent, setSent] = useState(false)
  const [errors, setErrors] = useState({})

  function handleChange(e) {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
    if (errors[name]) setErrors(e => ({ ...e, [name]: '' }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    const errs = {}
    if (!form.name.trim()) errs.name = 'Required'
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Valid email required'
    if (!form.message.trim()) errs.message = 'Required'
    if (Object.keys(errs).length) { setErrors(errs); return }
    setSent(true)
  }

  return (
    <>
      <section className="page-hero">
        <h1>Contact Us</h1>
        <p>We'd love to hear from you — reach out any time.</p>
      </section>

      <section className="section">
        <div className="container two-col" style={{ gap: '3rem', alignItems: 'flex-start' }}>

          {/* Contact info */}
          <div>
            <span className="section-tag">Get In Touch</span>
            <h2>We're Here to Help</h2>
            <p>Whether you have questions about volunteering, food donations, partnerships, or just want to say hello — our team is happy to connect.</p>

            <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {[
                { Icon: Mail,   label: 'Email', value: 'annasudhava@gmail.com' },
                { Icon: Phone,  label: 'Phone', value: '703-945-9313' },
                { Icon: MapPin, label: 'Address', value: '21100 Dulles Town Center, Ste 190\nDulles, VA 20166' },
                { Icon: Clock,  label: 'Kitchen Hours', value: 'Monday to Sunday – 9 AM to 5 PM' },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', gap: '1rem' }}>
                  <span style={{ minWidth: '2rem', paddingTop: '0.1rem', color: 'var(--maroon-bright)', flexShrink: 0 }}><item.Icon size={20} /></span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--maroon-bright)', marginBottom: '0.2rem' }}>{item.label}</div>
                    <div style={{ color: 'var(--text-muted)', whiteSpace: 'pre-line' }}>{item.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="form-card" style={{ flex: 1 }}>
            {sent ? (
              <div className="success-box">
                <div className="check"><Mail size={40} /></div>
                <h3>Message sent!</h3>
                <p>Thanks for reaching out. We'll get back to you at <strong>{form.email}</strong> within 1–2 business days.</p>
                <br />
                <button className="btn btn-primary" onClick={() => { setForm({ name:'', email:'', subject:'', message:'' }); setSent(false) }}>Send Another</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="name">Your Name *</label>
                    <input id="name" name="name" value={form.name} onChange={handleChange} placeholder="Jane Doe" />
                    {errors.name && <span className={styles.error}>{errors.name}</span>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email Address *</label>
                    <input id="email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="jane@example.com" />
                    {errors.email && <span className={styles.error}>{errors.email}</span>}
                  </div>
                  <div className="form-group full">
                    <label htmlFor="subject">Subject</label>
                    <input id="subject" name="subject" value={form.subject} onChange={handleChange} placeholder="How can we help?" />
                  </div>
                  <div className="form-group full">
                    <label htmlFor="message">Message *</label>
                    <textarea id="message" name="message" value={form.message} onChange={handleChange} placeholder="Write your message here…" style={{ minHeight: '140px' }} />
                    {errors.message && <span className={styles.error}>{errors.message}</span>}
                  </div>
                </div>
                <div className="form-submit">
                  <button type="submit" className="btn btn-primary">Send Message</button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
