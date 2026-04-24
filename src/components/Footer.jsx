import { Link } from 'react-router-dom'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <div className={styles.logo}><span className={styles.diamond}>◆</span> Anna Seva</div>
          <p>Nourishing Communities,<br />One Meal at a Time.</p>
          <p className={styles.tax}>501(c)(3) Non-Profit Organization</p>
        </div>

        <div className={styles.col}>
          <h4>Navigate</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/programs">Programs</Link></li>
            <li><Link to="/volunteer">Volunteer</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        <div className={styles.col}>
          <h4>Get Involved</h4>
          <ul>
            <li><Link to="/volunteer">Sign Up to Volunteer</Link></li>
            <li><Link to="/donate">Make a Donation</Link></li>
            <li><Link to="/programs">Our Programs</Link></li>
          </ul>
        </div>

        <div className={styles.col}>
          <h4>Contact</h4>
          <p>annasudhava@gmail.com</p>
          <p>703-945-9313</p>
          <p>21100 Dulles Town Center, Ste 190<br />Dulles, VA 20166</p>
        </div>
      </div>

      <div className={styles.bottom}>
        <p>&copy; {new Date().getFullYear()} Anna Seva. All rights reserved.</p>
      </div>
    </footer>
  )
}
