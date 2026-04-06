import { Box, Typography, Link as MuiLink } from '@mui/material'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Logo from '../Common/Logo'
import { COLORS } from '../../theme/theme'

export default function Footer() {
  const { t } = useTranslation()
  return (
    <Box
      component="footer"
      sx={{
        background: `linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)`,
        color: '#fff',
        py: 6,
        px: { xs: 3, md: 8 },
      }}
    >
      <Box
        sx={{
          maxWidth: 1200,
          mx: 'auto',
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 4,
          alignItems: { md: 'flex-start' },
        }}
      >
        <Box sx={{ flex: 1 }}>
          <Logo size="medium" white />
          <Typography
            sx={{
              mt: 2,
              color: 'rgba(255,255,255,0.6)',
              maxWidth: 280,
              fontSize: '0.9rem',
              lineHeight: 1.6,
            }}
          >
            {t('footer.tagline')}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <Box>
            <Typography
              sx={{
                fontFamily: "'Fugaz One', cursive",
                color: COLORS.third,
                mb: 2,
                fontSize: '0.9rem',
                letterSpacing: '0.05em',
              }}
            >
              Navigation
            </Typography>
            {[
              { label: t('nav.home'), path: '/' },
              { label: t('nav.dashboard'), path: '/dashboard' },
              { label: t('nav.analyze'), path: '/analyze' },
              { label: t('nav.reports'), path: '/reports' },
            ].map((item) => (
              <MuiLink
                key={item.path}
                component={Link}
                to={item.path}
                sx={{
                  display: 'block',
                  color: 'rgba(255,255,255,0.7)',
                  textDecoration: 'none',
                  mb: 0.75,
                  fontSize: '0.875rem',
                  '&:hover': { color: COLORS.third },
                  transition: 'color 0.2s',
                }}
              >
                {item.label}
              </MuiLink>
            ))}
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          maxWidth: 1200,
          mx: 'auto',
          mt: 4,
          pt: 3,
          borderTop: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>
          {t('footer.rights')}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {[COLORS.first, COLORS.second, COLORS.third].map((color, i) => (
            <Box
              key={i}
              sx={{ width: 8, height: 8, borderRadius: '50%', background: color }}
            />
          ))}
        </Box>
      </Box>
    </Box>
  )
}
