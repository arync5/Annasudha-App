import { Link } from 'react-router-dom'
import Reveal from '../components/Reveal'
import TiltCard from '../components/TiltCard'

const values = [
  { icon: '🤝', title: 'Dignity',       text: 'Every person we serve is treated with respect and compassion — always, without exception.' },
  { icon: '🌱', title: 'Sustainability', text: 'We rescue food that would otherwise go to waste, reducing environmental impact while feeding people.' },
  { icon: '🏘️', title: 'Community',      text: 'The best solutions come from within communities. We listen first, then act alongside — never for — the people we serve.' },
]

const team = [
  { initials: 'RS', name: 'Rekha Sharma',   role: 'Executive Director',    bio: 'Former public health advocate with 15 years of experience in food security initiatives.' },
  { initials: 'AK', name: 'Arjun Krishnan', role: 'Operations Director',   bio: 'Logistics expert who built our city-wide food rescue and delivery network from the ground up.' },
  { initials: 'PM', name: 'Priya Mehta',    role: 'Volunteer Coordinator', bio: 'Community organizer who manages our 1,200+ volunteer network with warmth and precision.' },
]

export default function About() {
  return (
    <>
      <section className="page-hero">
        <h1>About Anna Seva</h1>
        <p>Our story, values, and the people behind the mission.</p>
      </section>

      {/* ── Story — SPLIT left text, CLIP-DIAG right image ── */}
      <section className="section">
        <div className="container two-col">
          <Reveal variant="split">
            <div>
              <span className="section-tag">Our Story</span>
              <h2>Born from a Simple Belief</h2>
              <p>
                Anna Seva was founded in 2015 by a small group of community members who
                noticed the paradox of food waste alongside food insecurity in their
                neighborhoods. <em>Anna</em> means food and <em>Seva</em> means selfless
                service in Sanskrit — together, a commitment to serving food with devotion.
              </p>
              <p>
                What started as weekend meal distributions from a single kitchen has grown
                into a city-wide network of volunteers, partner organizations, and food
                donors — all united by one goal: no one goes hungry.
              </p>
              <Link to="/programs" className="btn btn-primary">See Our Programs</Link>
            </div>
          </Reveal>
          <Reveal variant="clip-diag" delay="0.15s">
            <div className="image-placeholder">
              <span>🏗️</span>
              <p>Our Founding Kitchen, 2015</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Values — GLITCH header, ZOOM-BLUR cards ── */}
      <section className="section how-section">
        <div className="container">
          <Reveal variant="glitch">
            <span className="section-tag center">Our Values</span>
            <h2 className="center">What We Stand For</h2>
          </Reveal>
          <div className="steps-grid">
            {values.map((v, i) => (
              <Reveal key={v.title} variant="zoom-blur" delay={`${i * 0.14}s`}>
                <TiltCard className="step-card">
                  <div className="step-icon">{v.icon}</div>
                  <h3>{v.title}</h3>
                  <p>{v.text}</p>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team — SCANLINE header, FLIP-3D cards ── */}
      <section className="section">
        <div className="container">
          <Reveal variant="scanline">
            <span className="section-tag center">Leadership</span>
            <h2 className="center">Our Team</h2>
          </Reveal>
          <div className="team-grid">
            {team.map((m, i) => (
              <Reveal key={m.name} variant="flip-3d" delay={`${i * 0.14}s`}>
                <TiltCard className="team-card">
                  <div className="team-avatar">{m.initials}</div>
                  <h3>{m.name}</h3>
                  <p className="team-role">{m.role}</p>
                  <p>{m.bio}</p>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA — NEON PULSE on dark background ── */}
      <section className="section cta-section">
        <div className="container center">
          <Reveal variant="neon-pulse">
            <h2>Ready to Make a Difference?</h2>
            <p>Join our team of dedicated volunteers or make a donation to support our work.</p>
            <div className="hero-cta" style={{ justifyContent: 'center' }}>
              <Link to="/volunteer" className="btn btn-primary">Volunteer</Link>
              <Link to="/donate" className="btn btn-outline">Donate</Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
