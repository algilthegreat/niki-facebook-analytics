import { useState, useEffect } from 'react'
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

export default function Register() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { user, register, loginWithGoogle, loading, error, clearError } = useAuthStore()

  useEffect(() => {
    if (user) navigate('/dashboard', { replace: true })
  }, [user, navigate])

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!name.trim()) errs.name = t('auth.errors.name_required')
    if (!email) errs.email = t('auth.errors.email_required')
    if (!password) errs.password = t('auth.errors.password_required')
    else if (password.length < 6) errs.password = t('auth.errors.password_min')
    if (password !== confirm) errs.confirm = t('auth.errors.passwords_match')
    setFieldErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()
    if (!validate()) return
    await register(email, password, name)
  }

  const handleGoogle = async () => {
    clearError()
    await loginWithGoogle()
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        background: `linear-gradient(135deg, ${COLORS.fourth} 0%, #fff 60%)`,
      }}
    >
      <Box
        sx={{
          flex: { xs: 1, md: '0 0 520px' },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: { xs: 3, md: 6 },
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 440 }}>
          <Box sx={{ display: { md: 'none' }, mb: 4, textAlign: 'center' }}>
            <Logo size="medium" />
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box>
              <Typography variant="h4" sx={{ fontSize: '1.8rem' }}>
                {t('auth.register_title')}
              </Typography>
              <Typography sx={{ color: 'text.secondary', mt: 0.5, fontSize: '0.9rem' }}>
                {t('auth.register_subtitle')}
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

          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label={t('auth.name')}
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={!!fieldErrors.name}
              helperText={fieldErrors.name}
              fullWidth
              autoComplete="name"
            />
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
              autoComplete="new-password"
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
            <TextField
              label={t('auth.confirm_password')}
              type={showPassword ? 'text' : 'password'}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              error={!!fieldErrors.confirm}
              helperText={fieldErrors.confirm}
              fullWidth
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{ py: 1.4, fontSize: '1rem', mt: 0.5 }}
            >
              {loading ? <CircularProgress size={22} color="inherit" /> : t('auth.register_btn')}
            </Button>
          </Box>

          <Typography sx={{ textAlign: 'center', mt: 3, color: 'text.secondary', fontSize: '0.875rem' }}>
            {t('auth.has_account')}{' '}
            <Box
              component={Link}
              to="/login"
              sx={{ color: COLORS.first, fontWeight: 700, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
            >
              {t('auth.login_btn')}
            </Box>
          </Typography>
        </Box>
      </Box>

      {/* Right decorative panel */}
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          flex: 1,
          background: `linear-gradient(135deg, ${COLORS.second} 0%, ${COLORS.first} 100%)`,
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: 6,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box sx={{ position: 'absolute', width: 350, height: 350, borderRadius: '50%', background: 'rgba(255,255,255,0.07)', top: -80, right: -80 }} />
        <Box sx={{ position: 'absolute', width: 250, height: 250, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', bottom: 40, left: 20 }} />
        <Logo size="large" white />
        <Typography sx={{ color: 'rgba(255,255,255,0.85)', mt: 4, fontSize: '1.2rem', textAlign: 'center', maxWidth: 280, lineHeight: 1.6 }}>
          Rejoignez des milliers d'entreprises qui boostent leur présence Facebook avec NIKI
        </Typography>
        <Box sx={{ mt: 4, p: 3, background: 'rgba(255,255,255,0.15)', borderRadius: 3, maxWidth: 300, width: '100%' }}>
          <Typography sx={{ color: '#fff', fontWeight: 700, mb: 1, fontFamily: "'Work Sans', sans-serif" }}>
            🎁 Plan Gratuit
          </Typography>
          {['5 analyses par mois', 'Rapports illimités', 'Support par email', '3 langues disponibles'].map((item) => (
            <Typography key={item} sx={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.875rem', py: 0.5 }}>
              ✓ {item}
            </Typography>
          ))}
        </Box>
      </Box>
    </Box>
  )
}
