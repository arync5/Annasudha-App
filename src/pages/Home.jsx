import { Link } from 'react-router-dom'
import { Wheat, ChefHat, Heart, Utensils } from 'lucide-react'
import Reveal from '../components/Reveal'
import TiltCard from '../components/TiltCard'
import Counter from '../components/Counter'

const stats = [
  { target: 50000, suffix: '+', label: 'Meals Served' },
  { target: 1200,  suffix: '+', label: 'Volunteers'   },
  { target: 30,    suffix: '+', label: 'Partner Orgs' },
  { target: 8,     suffix: '',  label: 'Cities Reached'},
]

const steps = [
  { Icon: Wheat,   title: 'Rescue',  text: 'We collect surplus and near-expiry food from restaurants, grocery stores, farms, and events before it goes to waste.' },
  { Icon: ChefHat, title: 'Prepare', text: 'Our volunteer kitchens sort, pack, and when possible cook wholesome meals that are ready for same-day distribution.' },
  { Icon: Heart,   title: 'Deliver', text: 'We bring meals directly to shelters, community centers, and families — always with compassion and respect.' },
]

export default function Home() {
  return (
    <>
      {/* ── Hero — own CSS stagger entrance ── */}
      <section className="hero">
        <div className="hero-content">
          <p className="hero-eyebrow">Non-Profit Organization</p>
          <h1>Nourishing <em>Communities</em>,<br />One Meal at a Time</h1>
          <p className="hero-sub">
            Anna Seva works to eliminate hunger and food insecurity by connecting
            surplus food with those who need it most.
          </p>
          <div className="hero-cta">
            <Link to="/volunteer" className="btn btn-primary">Become a Volunteer</Link>
            <Link to="/about" className="btn btn-outline">Learn More</Link>
          </div>
        </div>
      </section>

      {/* ── Stats — SCANLINE: printed line-by-line like a futuristic readout ── */}
      <section className="stats-bar">
        <Reveal variant="scanline">
          <div className="stats-inner">
            {stats.map(s => (
              <div key={s.label} className="stat">
                <span className="stat-num">
                  <Counter target={s.target} suffix={s.suffix} duration={1600} />
                </span>
                <span className="stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ── Mission — GLITCH left text, CLIP-DIAG right image ── */}
      <section className="section">
        <div className="container two-col">
          <Reveal variant="glitch">
            <div>
              <span className="section-tag">Our Mission</span>
              <h2>Food is a Right,<br />Not a Privilege</h2>
              <p>
                Anna Seva — <em>"selfless service through food"</em> in Sanskrit — was founded on
                the belief that no one should go to bed hungry. We partner with restaurants,
                farms, and individuals to rescue surplus food and distribute it with dignity
                to families and communities in need.
              </p>
              <p>
                Every meal we serve is a statement: you matter, your hunger matters, and
                this community has your back.
              </p>
              <Link to="/about" className="btn btn-primary">Our Story</Link>
            </div>
          </Reveal>
          <Reveal variant="clip-diag" delay="0.15s">
            <div className="image-placeholder">
              <Utensils size={56} />
              <p>Community Food Distribution</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── How it works — SPLIT header, FLIP-3D cards ── */}
      <section className="section how-section">
        <div className="container">
          <Reveal variant="split">
            <span className="section-tag center">How We Work</span>
            <h2 className="center">Three Steps to Change</h2>
          </Reveal>
          <div className="steps-grid">
            {steps.map((s, i) => (
              <Reveal key={s.title} variant="flip-3d" delay={`${i * 0.14}s`}>
                <TiltCard className="step-card">
                  <div className="step-icon"><s.Icon size={36} /></div>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA — NEON PULSE: powers on like a sign on a dark background ── */}
      <section className="section cta-section">
        <div className="container center">
          <Reveal variant="neon-pulse">
            <span className="section-tag center">Get Involved</span>
            <h2>Join Our Volunteer Family</h2>
            <p>
              Whether you can spare an hour or a whole weekend, every pair of hands
              makes a difference. Sign up today and become part of our mission.
            </p>
            <Link to="/volunteer" className="btn btn-primary">Sign Up to Volunteer</Link>
          </Reveal>
        </div>
      </section>
    </>
  )
}
