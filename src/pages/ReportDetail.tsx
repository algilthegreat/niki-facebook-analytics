import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Box,
  Button,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Avatar,
  Chip,
  Divider,
  Skeleton,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import PeopleIcon from '@mui/icons-material/People'
import VisibilityIcon from '@mui/icons-material/Visibility'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import ArticleIcon from '@mui/icons-material/Article'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import { useTranslation } from 'react-i18next'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import Navbar from '../components/Layout/Navbar'
import MetricCard from '../components/Dashboard/MetricCard'
import EngagementChart from '../components/Analysis/EngagementChart'
import PostsTable from '../components/Analysis/PostsTable'
import Recommendations from '../components/Analysis/Recommendations'
import { useAuthStore } from '../store/authStore'
import { useReportsStore, Report } from '../store/reportsStore'
import { COLORS } from '../theme/theme'

export default function ReportDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { user } = useAuthStore()
  const { reports, fetchReports } = useReportsStore()

  const [report, setReport] = useState<Report | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      if (!user?.uid) return
      if (reports.length === 0) {
        await fetchReports(user.uid)
      }
      const found = useReportsStore.getState().reports.find((r) => r.id === id)
      setReport(found || null)
      setLoading(false)
    }
    load()
  }, [id, user, fetchReports, reports.length])

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
      return format(d, 'dd MMMM yyyy à HH:mm', { locale: fr })
    } catch {
      return '—'
    }
  }

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', background: '#fafafa' }}>
        <Navbar />
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Skeleton variant="rounded" height={200} sx={{ mb: 3, borderRadius: 3 }} />
          <Grid container spacing={2.5} sx={{ mb: 3 }}>
            {[1, 2, 3, 4].map((i) => (
              <Grid item xs={6} md={3} key={i}>
                <Skeleton variant="rounded" height={120} sx={{ borderRadius: 3 }} />
              </Grid>
            ))}
          </Grid>
          <Skeleton variant="rounded" height={320} sx={{ borderRadius: 3 }} />
        </Container>
      </Box>
    )
  }

  if (!report) {
    return (
      <Box sx={{ minHeight: '100vh', background: '#fafafa' }}>
        <Navbar />
        <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
          <Typography variant="h5" sx={{ mb: 2, color: 'text.secondary' }}>
            Rapport introuvable
          </Typography>
          <Button variant="contained" startIcon={<ArrowBackIcon />} onClick={() => navigate('/reports')}>
            {t('report_detail.back')}
          </Button>
        </Container>
      </Box>
    )
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
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/reports')}
            sx={{ color: 'rgba(255,255,255,0.85)', mb: 2, '&:hover': { background: 'rgba(255,255,255,0.1)' } }}
          >
            {t('report_detail.back')}
          </Button>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            <Avatar
              src={report.pagePicture}
              sx={{ width: 64, height: 64, border: '3px solid rgba(255,255,255,0.5)' }}
            >
              {report.pageName?.[0]}
            </Avatar>
            <Box>
              <Typography variant="h3" sx={{ color: '#fff', fontSize: { xs: '1.6rem', md: '2.2rem' } }}>
                {report.pageName}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mt: 0.5, flexWrap: 'wrap' }}>
                <Chip
                  label={report.pageCategory}
                  size="small"
                  sx={{ background: 'rgba(255,255,255,0.2)', color: '#fff', fontWeight: 600 }}
                />
                <Chip
                  icon={<CalendarTodayIcon sx={{ color: 'rgba(255,255,255,0.8) !important', fontSize: '14px !important' }} />}
                  label={`${t('report_detail.generated')} ${formatDate(report.createdAt)}`}
                  size="small"
                  sx={{ background: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.9)', fontWeight: 500, fontSize: '0.75rem' }}
                />
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* KPI */}
        <Typography variant="h5" sx={{ mb: 2.5, fontSize: '1.2rem' }}>
          {t('report_detail.summary')}
        </Typography>
        <Grid container spacing={2.5} sx={{ mb: 4 }}>
          {[
            { title: t('analyze.metrics.fans'), value: report.fans, icon: <PeopleIcon />, color: COLORS.first },
            { title: t('analyze.metrics.reach'), value: report.reach, icon: <VisibilityIcon />, color: COLORS.second },
            { title: t('analyze.metrics.engagement'), value: report.engagement, icon: <TrendingUpIcon />, color: '#7c4dff', suffix: '%' },
            { title: t('analyze.metrics.posts'), value: report.postsCount, icon: <ArticleIcon />, color: '#00bcd4' },
          ].map((m, i) => (
            <Grid item xs={6} md={3} key={i}>
              <MetricCard
                title={m.title}
                value={m.value}
                icon={m.icon}
                color={m.color}
                suffix={m.suffix}
              />
            </Grid>
          ))}
        </Grid>

        {/* Charts */}
        <Typography variant="h5" sx={{ mb: 2.5, fontSize: '1.2rem' }}>
          {t('report_detail.evolution')}
        </Typography>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 3 }}>
              <EngagementChart
                data={report.dailyMetrics}
                title={t('analyze.engagement_chart')}
                type="engagement"
              />
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 3 }}>
              <EngagementChart
                data={report.dailyMetrics}
                title={t('analyze.reach_chart')}
                type="reach"
              />
            </Card>
          </Grid>
        </Grid>

        {/* Posts */}
        <Card sx={{ mb: 4, p: 3 }}>
          <Typography sx={{ fontFamily: "'Fugaz One', cursive", mb: 2.5, fontSize: '1.2rem' }}>
            {t('report_detail.posts_analysis')}
          </Typography>
          <PostsTable posts={report.topPosts} />
        </Card>

        {/* Recommendations */}
        <Card sx={{ p: 3 }}>
          <Typography sx={{ fontFamily: "'Fugaz One', cursive", mb: 2.5, fontSize: '1.2rem' }}>
            {t('report_detail.insights')}
          </Typography>
          <Recommendations />
        </Card>
      </Container>
    </Box>
  )
}
