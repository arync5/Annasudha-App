import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * role="admin"     → only admins pass; others go to /admin/login
 * role="volunteer" → volunteers and admins pass; others go to /portal/login
 */
export default function ProtectedRoute({ children, role = 'admin' }) {
  const { isAdmin, isVolunteer, loading } = useAuth()
  const location = useLocation()

  // Wait for Firebase to resolve the auth state before deciding
  if (loading) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: 'calc(100vh - 64px)', color: 'rgba(255,255,255,0.3)',
        fontSize: '0.9rem',
      }}>
        Loading…
      </div>
    )
  }

  const allowed    = role === 'admin' ? isAdmin : (isVolunteer || isAdmin)
  const loginPath  = role === 'admin' ? '/admin/login' : '/portal/login'

  if (!allowed) {
    return <Navigate to={loginPath} state={{ from: location }} replace />
  }

  return children
}
