import { useRef } from 'react'
import styles from './TiltCard.module.css'

/**
 * Wraps children in a card with a subtle 3-D tilt on hover + glow.
 * Pass `className` to apply additional classes to the outer div.
 */
export default function TiltCard({ children, className = '' }) {
  const cardRef = useRef(null)

  function handleMouseMove(e) {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const cx = rect.width / 2
    const cy = rect.height / 2
    const rotateX = ((y - cy) / cy) * -7   // max ±7deg
    const rotateY = ((x - cx) / cx) * 7
    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`

    // Spotlight glow that follows cursor
    const px = (x / rect.width) * 100
    const py = (y / rect.height) * 100
    card.style.setProperty('--glow-x', `${px}%`)
    card.style.setProperty('--glow-y', `${py}%`)
  }

  function handleMouseLeave() {
    const card = cardRef.current
    if (!card) return
    card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)'
  }

  return (
    <div
      ref={cardRef}
      className={`${styles.tilt} ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  )
}
