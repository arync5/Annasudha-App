import { useInView } from '../hooks/useInView'
import styles from './Reveal.module.css'

const VARIANT_MAP = {
  'up':         styles.varUp,
  'left':       styles.varLeft,
  'right':      styles.varRight,
  'scanline':   styles.varScanline,
  'clip-diag':  styles.varClipDiag,
  'zoom-blur':  styles.varZoomBlur,
  'flip-3d':    styles.varFlip3d,
  'glitch':     styles.varGlitch,
  'split':      styles.varSplit,
  'neon-pulse': styles.varNeonPulse,
}

/**
 * Scroll-triggered reveal with unique futuristic transitions.
 *
 * variant: 'up' | 'left' | 'right' | 'scanline' | 'clip-diag' |
 *          'zoom-blur' | 'flip-3d' | 'glitch' | 'split' | 'neon-pulse'
 * delay:   CSS time string  e.g. '0.15s'
 */
export default function Reveal({ children, variant = 'up', delay = '0s', className = '' }) {
  const [ref, inView] = useInView({ threshold: 0.08 })
  const varClass = VARIANT_MAP[variant] ?? styles.varUp

  return (
    <div
      ref={ref}
      className={`${styles.base} ${varClass} ${inView ? styles.visible : ''} ${className}`}
      style={{ '--rd': delay }}
    >
      {children}
    </div>
  )
}
