import { Box, Button, Container, Typography, Grid, Card, Chip, useTheme, useMediaQuery } from '@mui/material'
import { Link } from 'react-router-dom'
import BarChartIcon from '@mui/icons-material/BarChart'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import AssessmentIcon from '@mui/icons-material/Assessment'
import LanguageIcon from '@mui/icons-material/Language'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { useTranslation } from 'react-i18next'
import Navbar from '../components/Layout/Navbar'
import Footer from '../components/Layout/Footer'
import { COLORS } from '../theme/theme'
import { alpha } from '@mui/material/styles'

const FEATURES = [
  { key: 'analyze', icon: <BarChartIcon sx={{ fontSize: 32 }} />, color: COLORS.first },
  { key: 'automate', icon: <AutoAwesomeIcon sx={{ fontSize: 32 }} />, color: COLORS.second },
  { key: 'reports', icon: <AssessmentIcon sx={{ fontSize: 32 }} />, color: '#7c4dff' },
  { key: 'multilang', icon: <LanguageIcon sx={{ fontSize: 32 }} />, color: '#00bcd4' },
]

export default function Landing() {
  const { t } = useTranslation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      {/* Hero */}
      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          background: `linear-gradient(135deg, #fff 0%, ${COLORS.fourth} 50%, #fff 100%)`,
          py: { xs: 8, md: 14 },
          px: 2,
          textAlign: 'center',
        }}
      >
        {/* Decorative blobs */}
        {[
          { size: 400, x: '-10%', y: '-20%', color: alpha(COLORS.first, 0.06) },
          { size: 300, x: '80%', y: '60%', color: alpha(COLORS.second, 0.06) },
          { size: 200, x: '60%', y: '-10%', color: alpha(COLORS.third, 0.08) },
        ].map((blob, i) => (
          <Box
            key={i}
            sx={{
              position: 'absolute',
              width: blob.size,
              height: blob.size,
              borderRadius: '50%',
              background: blob.color,
              left: blob.x,
              top: blob.y,
              pointerEvents: 'none',
              filter: 'blur(40px)',
            }}
          />
        ))}

        <Container maxWidth="md" sx={{ position: 'relative' }}>
          <Chip
            label="✨ Analytics Facebook nouvelle génération"
            sx={{
              mb: 3,
              background: COLORS.fourth,
              color: COLORS.first,
              fontWeight: 600,
              fontSize: '0.85rem',
              px: 1,
            }}
          />
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2.5rem', sm: '3.5rem', md: '5rem' },
              lineHeight: 1.1,
              mb: 1,
              color: 'text.primary',
            }}
          >
            {t('landing.hero_title')}
          </Typography>
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2.5rem', sm: '3.5rem', md: '5rem' },
              lineHeight: 1.1,
              mb: 3,
              background: `linear-gradient(135deg, ${COLORS.first} 0%, ${COLORS.second} 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {t('landing.hero_title_accent')}
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: '1rem', md: '1.2rem' },
              color: 'text.secondary',
              maxWidth: 560,
              mx: 'auto',
              mb: 5,
              lineHeight: 1.7,
            }}
          >
            {t('landing.hero_subtitle')}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              component={Link}
              to="/register"
              variant="contained"
              size="large"
              endIcon={<ArrowForwardIcon />}
              sx={{ px: 4, py: 1.5, fontSize: '1rem' }}
            >
              {t('landing.cta_start')}
            </Button>
            <Button
              component={Link}
              to="/login"
              variant="outlined"
              size="large"
              sx={{
                px: 4,
                py: 1.5,
                fontSize: '1rem',
                borderColor: COLORS.first,
                color: COLORS.first,
                '&:hover': { background: COLORS.fourth, borderColor: COLORS.second },
              }}
            >
              {t('landing.cta_demo')}
            </Button>
          </Box>

          {/* Stats strip */}
          <Box
            sx={{
              mt: 8,
              display: 'flex',
              gap: { xs: 2, md: 6 },
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            {[
              { val: '10K+', label: 'Pages analysées' },
              { val: '98%', label: 'Satisfaction' },
              { val: '3 langues', label: 'disponibles' },
            ].map((stat) => (
              <Box key={stat.label} sx={{ textAlign: 'center' }}>
                <Typography
                  sx={{
                    fontFamily: "'Fugaz One', cursive",
                    fontSize: { xs: '1.8rem', md: '2.2rem' },
                    color: COLORS.first,
                    lineHeight: 1,
                  }}
                >
                  {stat.val}
                </Typography>
                <Typography sx={{ fontSize: '0.8rem', color: 'text.secondary', mt: 0.5 }}>
                  {stat.label}
                </Typography>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Features */}
      <Box sx={{ py: { xs: 8, md: 12 }, px: 2, background: '#fff' }}>
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            sx={{
              textAlign: 'center',
              mb: 1,
              fontSize: { xs: '2rem', md: '2.8rem' },
            }}
          >
            {t('landing.feature_title')}
          </Typography>
          <Typography
            sx={{
              textAlign: 'center',
              color: 'text.secondary',
              mb: 7,
              fontSize: '1.05rem',
            }}
          >
            Une suite complète pour piloter votre présence Facebook
          </Typography>
          <Grid container spacing={3}>
            {FEATURES.map((f) => (
              <Grid item xs={12} sm={6} md={3} key={f.key}>
                <Card
                  sx={{
                    p: 3.5,
                    height: '100%',
                    textAlign: 'center',
                    border: `1px solid ${COLORS.fourth}`,
                    '&:hover': {
                      borderColor: f.color,
                      '& .feat-icon': { background: f.color, color: '#fff' },
                    },
                    transition: 'border-color 0.2s',
                  }}
                >
                  <Box
                    className="feat-icon"
                    sx={{
                      width: 70,
                      height: 70,
                      borderRadius: 3,
                      background: alpha(f.color, 0.1),
                      color: f.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 2.5,
                      transition: 'all 0.2s',
                    }}
                  >
                    {f.icon}
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{ mb: 1.5, fontSize: '1.05rem' }}
                  >
                    {t(`landing.features.${f.key}.title`)}
                  </Typography>
                  <Typography sx={{ color: 'text.secondary', fontSize: '0.875rem', lineHeight: 1.6 }}>
                    {t(`landing.features.${f.key}.desc`)}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* How it works */}
      <Box
        sx={{
          py: { xs: 8, md: 12 },
          px: 2,
          background: `linear-gradient(135deg, ${COLORS.fourth} 0%, #fff 100%)`,
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h2"
            sx={{
              textAlign: 'center',
              mb: 8,
              fontSize: { xs: '2rem', md: '2.8rem' },
            }}
          >
            {t('landing.how_title')}
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {['1', '2', '3', '4'].map((step) => (
              <Box
                key={step}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 3,
                  background: '#fff',
                  borderRadius: 3,
                  p: 3,
                  boxShadow: '0 2px 20px rgba(0,0,0,0.06)',
                }}
              >
                <Box
                  sx={{
                    width: 52,
                    height: 52,
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${COLORS.first}, ${COLORS.second})`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: "'Fugaz One', cursive",
                      color: '#fff',
                      fontSize: '1.3rem',
                    }}
                  >
                    {step}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                  <CheckCircleIcon sx={{ color: COLORS.third, fontSize: 22, flexShrink: 0 }} />
                  <Typography sx={{ fontWeight: 500, fontSize: '1rem' }}>
                    {t(`landing.steps.${step}`)}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* CTA Banner */}
      <Box
        sx={{
          py: { xs: 8, md: 10 },
          px: 2,
          background: `linear-gradient(135deg, ${COLORS.first} 0%, ${COLORS.second} 100%)`,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="sm">
          <Typography
            variant="h2"
            sx={{
              color: '#fff',
              fontSize: { xs: '1.8rem', md: '2.5rem' },
              mb: 2,
            }}
          >
            Prêt à analyser votre page ?
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.85)', mb: 4, fontSize: '1.05rem' }}>
            Rejoignez des milliers d'entreprises qui utilisent NIKI
          </Typography>
          <Button
            component={Link}
            to="/register"
            variant="contained"
            size="large"
            sx={{
              background: '#fff',
              color: COLORS.first,
              px: 5,
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 700,
              '&:hover': { background: COLORS.fourth, boxShadow: '0 8px 30px rgba(0,0,0,0.2)' },
            }}
          >
            Commencer gratuitement
          </Button>
        </Container>
      </Box>

      <Footer />
    </Box>
  )
}
