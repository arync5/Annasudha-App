import { Link } from 'react-router-dom'
import { Utensils, Truck, Home, Leaf, BookOpen, Zap } from 'lucide-react'
import Reveal from '../components/Reveal'
import TiltCard from '../components/TiltCard'

// Each card gets its own distinct transition so every section feels different
const CARD_VARIANTS = ['flip-3d', 'clip-diag', 'zoom-blur', 'split', 'glitch', 'scanline']

const programs = [
  {
    Icon: Utensils,
    title: 'Community Kitchen',
    desc: 'Our flagship program runs weekend community kitchens where volunteers cook and serve hot meals to anyone who walks through our doors — no questions asked.',
    details: ['Every Saturday & Sunday, 11am – 2pm', 'Locations in 8 cities', '400+ meals served each weekend'],
  },
  {
    Icon: Truck,
    title: 'Food Rescue',
    desc: 'We partner with restaurants, caterers, and grocery stores to collect surplus food before it goes to waste and redistribute it to families in need the same day.',
    details: ['Daily pickups, 7 days a week', '80+ food donor partners', '10,000 lbs of food rescued monthly'],
  },
  {
    Icon: Home,
    title: 'Family Pantry',
    desc: 'Registered families can visit our pantry twice a month to pick up grocery staples, fresh produce, and personal care items — with dignity and privacy.',
    details: ['Open every 1st & 3rd Saturday', '250+ registered families', 'Culturally diverse food options'],
  },
  {
    Icon: Leaf,
    title: 'School Nutrition',
    desc: "Partnering with Title I schools to provide breakfast snack bags and weekend meal kits so children don't go hungry when school lunch is unavailable.",
    details: ['12 partner schools', '600+ children supported', 'Active during the school year'],
  },
  {
    Icon: BookOpen,
    title: 'Nutrition Education',
    desc: 'Monthly workshops teaching budget-friendly cooking, nutrition basics, and food safety — empowering communities with lasting skills beyond the meal.',
    details: ['Free and open to the public', 'Bilingual sessions available', 'Recipe kits provided'],
  },
  {
    Icon: Zap,
    title: 'Crisis Response',
    desc: 'When disasters or emergencies strike, Anna Seva deploys rapid-response food teams within 24 hours to affected communities, no matter what.',
    details: ['On-call volunteer teams', 'Emergency food stockpile maintained', 'Coordinated with local agencies'],
  },
]

export default function Programs() {
  return (
    <>
      <section className="page-hero">
        <h1>Our Programs</h1>
        <p>Comprehensive initiatives to fight hunger from every angle.</p>
      </section>

      {/* ── Program cards — each gets its own unique transition ── */}
      <section className="section">
        <div className="container">
          <Reveal variant="glitch">
            <span className="section-tag center">What We Do</span>
            <h2 className="center" style={{ marginBottom: '2.5rem' }}>Six Ways We Fight Hunger</h2>
          </Reveal>
          <div className="programs-grid">
            {programs.map((p, i) => (
              <Reveal
                key={p.title}
                variant={CARD_VARIANTS[i % CARD_VARIANTS.length]}
                delay={`${(i % 3) * 0.1}s`}
              >
                <TiltCard className="program-card">
                  <div className="program-icon"><p.Icon size={40} /></div>
                  <h3>{p.title}</h3>
                  <p>{p.desc}</p>
                  <ul className="program-details">
                    {p.details.map(d => <li key={d}>{d}</li>)}
                  </ul>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA — ZOOM-BLUR on dark background ── */}
      <section className="section cta-section">
        <div className="container center">
          <Reveal variant="zoom-blur">
            <h2>Help Power These Programs</h2>
            <p>Every program runs on the energy of our volunteers and the generosity of our donors.</p>
            <div className="hero-cta" style={{ justifyContent: 'center' }}>
              <Link to="/volunteer" className="btn btn-primary">Volunteer Now</Link>
              <Link to="/donate" className="btn btn-outline">Make a Donation</Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
