import { Routes, Route, useLocation } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollProgress from './components/ScrollProgress'
import PageTransition from './components/PageTransition'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import About from './pages/About'
import Programs from './pages/Programs'
import Volunteer from './pages/Volunteer'
import Contact from './pages/Contact'
import Donate from './pages/Donate'
import Inventory from './pages/Inventory'
import Login from './pages/Login'
import VolunteerPortal from './pages/VolunteerPortal'
import VolunteerDashboard from './pages/VolunteerDashboard'

export default function App() {
  const location = useLocation()

  return (
    <AuthProvider>
      <ScrollProgress />
      <Navbar />
      <main>
        <PageTransition key={location.pathname}>
          <Routes location={location}>
            {/* Public routes */}
            <Route path="/"          element={<Home />} />
            <Route path="/about"     element={<About />} />
            <Route path="/programs"  element={<Programs />} />
            <Route path="/volunteer" element={<Volunteer />} />
            <Route path="/contact"   element={<Contact />} />
            <Route path="/donate"    element={<Donate />} />

            {/* Auth portals */}
            <Route path="/admin/login"  element={<Login />} />
            <Route path="/portal/login" element={<VolunteerPortal />} />

            {/* Protected: admin only */}
            <Route
              path="/inventory"
              element={
                <ProtectedRoute role="admin">
                  <Inventory />
                </ProtectedRoute>
              }
            />

            {/* Protected: volunteers (and admins) */}
            <Route
              path="/portal"
              element={
                <ProtectedRoute role="volunteer">
                  <VolunteerDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </PageTransition>
      </main>
      <Footer />
    </AuthProvider>
  )
}
