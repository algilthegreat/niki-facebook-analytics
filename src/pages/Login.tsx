import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Box,
  Button,
  TextField,
  Typography,
  Divider,
  Alert,
  InputAdornment,
  IconButton,
  CircularProgress,
} from '@mui/material'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import GoogleIcon from '@mui/icons-material/Google'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '../store/authStore'
import Logo from '../components/Common/Logo'
import LanguageSwitcher from '../components/Common/LanguageSwitcher'
import { COLORS } from '../theme/theme'

export default function Login() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { login, loginWithGoogle, loading, error, clearError } = useAuthStore()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({})

  const validate = () => {
    const errs: typeof fieldErrors = {}
    if (!email) errs.email = t('auth.errors.email_required')
    if (!password) errs.password = t('auth.errors.password_required')
    setFieldErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()
    if (!validate()) return
    await login(email, password)
    if (!useAuthStore.getState().error) {
      navigate('/dashboard')
    }
  }

  const handleGoogle = async () => {
    clearError()
    await loginWithGoogle()
    if (!useAuthStore.getState().error) {
      navigate('/dashboard')
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        background: `linear-gradient(135deg, ${COLORS.fourth} 0%, #fff 60%)`,
      }}
    >
      {/* Left panel - decorative */}
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          flex: 1,
          background: `linear-gradient(135deg, ${COLORS.first} 0%, ${COLORS.second} 100%)`,
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: 6,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.08)',
            bottom: -100,
            right: -100,
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.06)',
            top: 40,
            left: 40,
          }}
        />
        <Logo size="large" white />
        <Typography
          sx={{
            color: 'rgba(255,255,255,0.9)',
            mt: 4,
            fontSize: '1.2rem',
            textAlign: 'center',
            maxWidth: 300,
            lineHeight: 1.6,
          }}
        >
          {t('app.description')}
        </Typography>
        {[
          '📊 Analysez vos métriques en temps réel',
          '🤖 Recommandations automatiques',
          '📈 Suivez l\'évolution de votre page',
        ].map((item) => (
          <Box
            key={item}
            sx={{
              mt: 2,
              background: 'rgba(255,255,255,0.15)',
              borderRadius: 2,
              px: 2.5,
              py: 1.2,
              width: '100%',
              maxWidth: 320,
            }}
          >
            <Typography sx={{ color: '#fff', fontSize: '0.9rem' }}>{item}</Typography>
          </Box>
        ))}
      </Box>

      {/* Right panel - form */}
      <Box
        sx={{
          flex: { xs: 1, md: '0 0 480px' },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: { xs: 3, md: 6 },
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 400 }}>
          {/* Mobile logo */}
          <Box sx={{ display: { md: 'none' }, mb: 4, textAlign: 'center' }}>
            <Logo size="medium" />
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Box>
              <Typography variant="h4" sx={{ fontSize: '1.8rem' }}>
                {t('auth.login_title')}
              </Typography>
              <Typography sx={{ color: 'text.secondary', mt: 0.5, fontSize: '0.9rem' }}>
                {t('auth.login_subtitle')}
              </Typography>
            </Box>
            <LanguageSwitcher />
          </Box>

          {error && (
            <Alert severity="error" onClose={clearError} sx={{ mb: 2, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <Button
            fullWidth
            variant="outlined"
            startIcon={<GoogleIcon />}
            onClick={handleGoogle}
            disabled={loading}
            sx={{
              mb: 3,
              py: 1.3,
              borderColor: '#e0e0e0',
              color: 'text.primary',
              '&:hover': { borderColor: COLORS.first, background: COLORS.fourth },
            }}
          >
            {t('auth.google_login')}
          </Button>

          <Divider sx={{ mb: 3 }}>
            <Typography sx={{ px: 1, color: 'text.secondary', fontSize: '0.8rem' }}>ou</Typography>
          </Divider>

          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <TextField
              label={t('auth.email')}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={!!fieldErrors.email}
              helperText={fieldErrors.email}
              fullWidth
              autoComplete="email"
            />
            <TextField
              label={t('auth.password')}
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={!!fieldErrors.password}
              helperText={fieldErrors.password}
              fullWidth
              autoComplete="current-password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword((v) => !v)} edge="end" size="small">
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{ py: 1.4, fontSize: '1rem', mt: 0.5 }}
            >
              {loading ? <CircularProgress size={22} color="inherit" /> : t('auth.login_btn')}
            </Button>
          </Box>

          <Typography sx={{ textAlign: 'center', mt: 3, color: 'text.secondary', fontSize: '0.875rem' }}>
            {t('auth.no_account')}{' '}
            <Box
              component={Link}
              to="/register"
              sx={{ color: COLORS.first, fontWeight: 700, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
            >
              {t('nav.register')}
            </Box>
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}
