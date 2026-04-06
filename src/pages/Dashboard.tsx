import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  CardActions,
  Chip,
  Avatar,
  Skeleton,
  Divider,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import AssessmentIcon from '@mui/icons-material/Assessment'
import PeopleIcon from '@mui/icons-material/People'
import VisibilityIcon from '@mui/icons-material/Visibility'
import BarChartIcon from '@mui/icons-material/BarChart'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { useTranslation } from 'react-i18next'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import Navbar from '../components/Layout/Navbar'
import MetricCard from '../components/Dashboard/MetricCard'
import { useAuthStore } from '../store/authStore'
import { useReportsStore } from '../store/reportsStore'
import { COLORS } from '../theme/theme'

export default function Dashboard() {
  const { t } = useTranslation()
  const { user } = useAuthStore()
  const { reports, loading, fetchReports } = useReportsStore()

  useEffect(() => {
    if (user?.uid) fetchReports(user.uid)
  }, [user, fetchReports])

  const totalFans = reports.reduce((s, r) => s + (r.fans || 0), 0)
  const totalReach = reports.reduce((s, r) => s + (r.reach || 0), 0)
  const avgEngagement = reports.length
    ? Math.round(reports.reduce((s, r) => s + (r.engagement || 0), 0) / reports.length)
    : 0
  const uniquePages = new Set(reports.map((r) => r.pageId)).size

  const formatDate = (dateVal: unknown): string => {
    try {
      let d: Date
      if (dateVal && typeof dateVal === 'object' && 'toDate' in dateVal) {
        d = (dateVal as { toDate: () => Date }).toDate()
      } else if (typeof dateVal === 'string') {
        d = new Date(dateVal)
      } else {
        d = new Date()
      }
      return format(d, 'dd MMM yyyy', { locale: fr })
    } catch {
      return '—'
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', background: '#fafafa' }}>
      <Navbar />

      {/* Header */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${COLORS.first} 0%, ${COLORS.second} 100%)`,
          py: { xs: 4, md: 5 },
          px: 2,
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar
                src={user?.photoURL || undefined}
                sx={{
                  width: 52,
                  height: 52,
                  background: 'rgba(255,255,255,0.3)',
                  fontSize: '1.2rem',
                  fontWeight: 700,
                  border: '3px solid rgba(255,255,255,0.5)',
                }}
              >
                {user?.displayName?.[0]?.toUpperCase() || 'U'}
              </Avatar>
              <Box>
                <Typography
                  sx={{
                    color: 'rgba(255,255,255,0.8)',
                    fontSize: '0.875rem',
                    fontFamily: "'Work Sans', sans-serif",
                  }}
                >
                  {t('dashboard.welcome')},
                </Typography>
                <Typography
                  sx={{
                    color: '#fff',
                    fontFamily: "'Fugaz One', cursive",
                    fontSize: '1.6rem',
                    lineHeight: 1.1,
                  }}
                >
                  {user?.displayName || user?.email?.split('@')[0] || 'Utilisateur'}
                </Typography>
              </Box>
            </Box>
            <Button
              component={Link}
              to="/analyze"
              variant="contained"
              startIcon={<AddIcon />}
              sx={{
                background: '#fff',
                color: COLORS.first,
                fontWeight: 700,
                '&:hover': { background: COLORS.fourth },
              }}
            >
              {t('dashboard.new_analysis')}
            </Button>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Stats */}
        <Grid container spacing={3} sx={{ mb: 5 }}>
          {[
            {
              title: t('dashboard.total_pages'),
              value: uniquePages,
              icon: <PeopleIcon />,
              color: COLORS.first,
              trend: 12,
            },
            {
              title: t('dashboard.total_reports'),
              value: reports.length,
              icon: <AssessmentIcon />,
              color: COLORS.second,
              trend: 8,
            },
            {
              title: t('dashboard.total_reach'),
              value: totalReach,
              icon: <VisibilityIcon />,
              color: '#7c4dff',
              trend: 23,
            },
            {
              title: t('dashboard.total_engagement'),
              value: avgEngagement,
              icon: <BarChartIcon />,
              color: '#00bcd4',
              suffix: '%',
              trend: -3,
            },
          ].map((card, i) => (
            <Grid item xs={12} sm={6} md={3} key={i}>
              {loading ? (
                <Skeleton variant="rounded" height={120} sx={{ borderRadius: 3 }} />
              ) : (
                <MetricCard
                  title={card.title}
                  value={card.value}
                  icon={card.icon}
                  color={card.color}
                  trend={card.trend}
                  suffix={card.suffix}
                />
              )}
            </Grid>
          ))}
        </Grid>

        {/* Quick actions */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                p: 0,
                overflow: 'hidden',
                background: `linear-gradient(135deg, ${COLORS.first} 0%, ${COLORS.second} 100%)`,
                cursor: 'pointer',
                '&:hover': { transform: 'translateY(-2px)' },
                transition: 'transform 0.2s',
              }}
              component={Link}
              to="/analyze"
              style={{ textDecoration: 'none' }}
            >
              <CardContent sx={{ p: 3 }}>
                <BarChartIcon sx={{ color: 'rgba(255,255,255,0.7)', fontSize: 36, mb: 1 }} />
                <Typography
                  sx={{
                    fontFamily: "'Fugaz One', cursive",
                    color: '#fff',
                    fontSize: '1.1rem',
                    mb: 0.5,
                  }}
                >
                  {t('dashboard.new_analysis')}
                </Typography>
                <Typography sx={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.85rem' }}>
                  Analysez une nouvelle page Facebook
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card
              sx={{
                p: 0,
                overflow: 'hidden',
                border: `2px solid ${COLORS.fourth}`,
                cursor: 'pointer',
                '&:hover': { borderColor: COLORS.first, transform: 'translateY(-2px)' },
                transition: 'all 0.2s',
              }}
              component={Link}
              to="/reports"
              style={{ textDecoration: 'none' }}
            >
              <CardContent sx={{ p: 3 }}>
                <AssessmentIcon sx={{ color: COLORS.first, fontSize: 36, mb: 1 }} />
                <Typography
                  sx={{
                    fontFamily: "'Fugaz One', cursive",
                    color: 'text.primary',
                    fontSize: '1.1rem',
                    mb: 0.5,
                  }}
                >
                  {t('dashboard.view_all_reports')}
                </Typography>
                <Typography sx={{ color: 'text.secondary', fontSize: '0.85rem' }}>
                  {reports.length} rapport{reports.length > 1 ? 's' : ''} disponible{reports.length > 1 ? 's' : ''}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Recent reports */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" sx={{ fontSize: '1.3rem' }}>
            {t('dashboard.recent_reports')}
          </Typography>
          {reports.length > 0 && (
            <Button
              component={Link}
              to="/reports"
              endIcon={<ArrowForwardIcon />}
              sx={{ color: COLORS.first, fontWeight: 600 }}
            >
              {t('dashboard.view_all_reports')}
            </Button>
          )}
        </Box>

        {loading ? (
          <Grid container spacing={2}>
            {[1, 2, 3].map((i) => (
              <Grid item xs={12} sm={6} md={4} key={i}>
                <Skeleton variant="rounded" height={180} sx={{ borderRadius: 3 }} />
              </Grid>
            ))}
          </Grid>
        ) : reports.length === 0 ? (
          <Box
            sx={{
              textAlign: 'center',
              py: 8,
              background: '#fff',
              borderRadius: 4,
              border: `2px dashed ${COLORS.third}`,
            }}
          >
            <BarChartIcon sx={{ fontSize: 64, color: COLORS.third, mb: 2 }} />
            <Typography variant="h6" sx={{ mb: 1, color: 'text.secondary' }}>
              {t('dashboard.no_reports')}
            </Typography>
            <Typography sx={{ color: 'text.secondary', mb: 3, fontSize: '0.9rem' }}>
              {t('dashboard.no_reports_desc')}
            </Typography>
            <Button
              component={Link}
              to="/analyze"
              variant="contained"
              startIcon={<AddIcon />}
            >
              {t('dashboard.analyze_now')}
            </Button>
          </Box>
        ) : (
          <Grid container spacing={2}>
            {reports.slice(0, 6).map((report) => (
              <Grid item xs={12} sm={6} md={4} key={report.id}>
                <Card
                  component={Link}
                  to={`/reports/${report.id}`}
                  style={{ textDecoration: 'none' }}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    '&:hover': { transform: 'translateY(-3px)' },
                    transition: 'transform 0.2s',
                  }}
                >
                  <CardContent sx={{ flex: 1, p: 2.5 }}>
                    <Box sx={{ display: 'flex', gap: 1.5, mb: 2 }}>
                      <Avatar src={report.pagePicture} sx={{ width: 42, height: 42 }}>
                        {report.pageName?.[0]}
                      </Avatar>
                      <Box sx={{ flex: 1, overflow: 'hidden' }}>
                        <Typography
                          sx={{
                            fontWeight: 700,
                            fontSize: '0.95rem',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {report.pageName}
                        </Typography>
                        <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                          {formatDate(report.createdAt)}
                        </Typography>
                      </Box>
                    </Box>
                    <Divider sx={{ mb: 2 }} />
                    <Grid container spacing={1}>
                      {[
                        { label: 'Abonnés', val: report.fans?.toLocaleString('fr-FR'), color: COLORS.first },
                        { label: 'Portée', val: report.reach?.toLocaleString('fr-FR'), color: COLORS.second },
                        { label: 'Engagement', val: `${report.engagement}%`, color: '#7c4dff' },
                      ].map((m) => (
                        <Grid item xs={4} key={m.label}>
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography
                              sx={{
                                fontFamily: "'Fugaz One', cursive",
                                fontSize: '1rem',
                                color: m.color,
                              }}
                            >
                              {m.val}
                            </Typography>
                            <Typography sx={{ fontSize: '0.7rem', color: 'text.secondary' }}>
                              {m.label}
                            </Typography>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </CardContent>
                  <CardActions sx={{ px: 2.5, pb: 2 }}>
                    <Chip
                      label={report.pageCategory || 'Facebook'}
                      size="small"
                      sx={{
                        background: COLORS.fourth,
                        color: COLORS.first,
                        fontSize: '0.7rem',
                        fontWeight: 600,
                      }}
                    />
                    <Box sx={{ ml: 'auto' }}>
                      <ArrowForwardIcon sx={{ fontSize: 18, color: COLORS.first }} />
                    </Box>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  )
}
