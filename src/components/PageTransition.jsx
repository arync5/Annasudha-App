import { useLocation } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import styles from './PageTransition.module.css'

export default function PageTransition({ children }) {
  const location = useLocation()
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.classList.remove(styles.enter)
    // Force reflow
    void el.offsetWidth
    el.classList.add(styles.enter)
  }, [location.pathname])

  return (
    <div ref={ref} className={styles.wrapper}>
      {children}
    </div>
  )
}
