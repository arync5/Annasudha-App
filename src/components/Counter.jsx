import { useEffect, useRef, useState } from 'react'
import { useInView } from '../hooks/useInView'

/**
 * Animates a number from 0 to `target` once in view.
 * `suffix` is appended after the number (e.g. '+', ' Cities').
 * `prefix` is prepended (e.g. '$').
 */
export default function Counter({ target, suffix = '', prefix = '', duration = 1800 }) {
  const [ref, inView] = useInView()
  const [display, setDisplay] = useState(0)
  const raf = useRef(null)

  useEffect(() => {
    if (!inView) return
    let start = null

    function step(ts) {
      if (!start) start = ts
      const elapsed = ts - start
      const progress = Math.min(elapsed / duration, 1)
      // Ease-out quart
      const eased = 1 - Math.pow(1 - progress, 4)
      setDisplay(Math.round(eased * target))
      if (progress < 1) raf.current = requestAnimationFrame(step)
    }

    raf.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf.current)
  }, [inView, target, duration])

  const formatted = display.toLocaleString()

  return (
    <span ref={ref}>
      {prefix}{formatted}{suffix}
    </span>
  )
}
