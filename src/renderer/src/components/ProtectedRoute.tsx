import { useAuth } from '@/context/AuthContext'
import { Navigate } from 'react-router-dom'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
} 