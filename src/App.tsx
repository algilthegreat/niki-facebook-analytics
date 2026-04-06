import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider, CssBaseline } from '@mui/material'
import { theme } from './theme/theme'
import { useAuthStore } from './store/authStore'
import LoadingScreen from './components/Common/LoadingScreen'
import AuthGuard from './components/Layout/AuthGuard'

import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Analyze from './pages/Analyze'
import Reports from './pages/Reports'
import ReportDetail from './pages/ReportDetail'

export default function App() {
  const { init, initialized } = useAuthStore()

  useEffect(() => {
    const unsubscribe = init()
    return unsubscribe
  }, [init])

  if (!initialized) return (
    <ThemeProvider theme={theme}>
      <LoadingScreen />
    </ThemeProvider>
  )

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected */}
          <Route
            path="/dashboard"
            element={
              <AuthGuard>
                <Dashboard />
              </AuthGuard>
            }
          />
          <Route
            path="/analyze"
            element={
              <AuthGuard>
                <Analyze />
              </AuthGuard>
            }
          />
          <Route
            path="/reports"
            element={
              <AuthGuard>
                <Reports />
              </AuthGuard>
            }
          />
          <Route
            path="/reports/:id"
            element={
              <AuthGuard>
                <ReportDetail />
              </AuthGuard>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}
