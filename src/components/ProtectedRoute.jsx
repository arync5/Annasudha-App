import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * role="admin"     → only admins pass; redirect to /admin/login
 * role="volunteer" → volunteers (and admins) pass; redirect to /portal/login
 */
export default function ProtectedRoute({ children, role = 'admin' }) {
  const { isAdmin, isVolunteer } = useAuth()
  const location = useLocation()

  const allowed = role === 'admin' ? isAdmin : (isVolunteer || isAdmin)
  const loginPath = role === 'admin' ? '/admin/login' : '/portal/login'

  if (!allowed) {
    return <Navigate to={loginPath} state={{ from: location }} replace />
  }

  return children
}
