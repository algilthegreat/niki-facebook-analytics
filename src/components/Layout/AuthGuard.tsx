import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import LoadingScreen from '../Common/LoadingScreen'

interface AuthGuardProps {
  children: React.ReactNode
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { user, initialized } = useAuthStore()

  if (!initialized) return <LoadingScreen />
  if (!user) return <Navigate to="/login" replace />

  return <>{children}</>
}
