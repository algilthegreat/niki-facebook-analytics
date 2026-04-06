import { useState } from 'react'
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Grid,
  Card,
  CardContent,
  Alert,
  AlertTitle,
  Chip,
  Avatar,
  Divider,
  CircularProgress,
  Snackbar,
  Tab,
  Tabs,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import FacebookIcon from '@mui/icons-material/Facebook'
import SaveIcon from '@mui/icons-material/Save'
import PeopleIcon from '@mui/icons-material/People'
import VisibilityIcon from '@mui/icons-material/Visibility'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import ArticleIcon from '@mui/icons-material/Article'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { useTranslation } from 'react-i18next'
import Navbar from '../components/Layout/Navbar'
import MetricCard from '../components/Dashboard/MetricCard'
import EngagementChart from '../components/Analysis/EngagementChart'
import PostsTable from '../components/Analysis/PostsTable'
import Recommendations from '../components/Analysis/Recommendations'
import { useAuthStore } from '../store/authStore'
import { useReportsStore } from '../store/reportsStore'
import { generateMockReport } from '../services/mockData'
import { COLORS } from '../theme/theme'
import { Report } from '../store/reportsStore'

export default function Analyze() {
  const { t } = useTranslation()
  const { user } = useAuthStore()
  const { saveReport } = useReportsStore()

  const [pageInput, setPageInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [report, setReport] = useState<Omit<Report, 'id' | 'userId' | 'createdAt'> | null>(null)
  const [saved, setSaved] = useState(false)
  const [snackbar, setSnackbar] = useState(false)
  const [tab, setTab] = useState(0)

  const handleAnalyze = async () => {
    if (!pageInput.trim()) return
    setLoading(true)
    setSaved(false)
    setReport(null)
    // Simulate API call with mock data
    await new Promise((r) => setTimeout(r, 1800))
    const pageName = pageInput.replace(/^https?:\/\/(www\.)?facebook\.com\//, '').split('/')[0]
    const data = generateMockReport(pageInput, pageName || pageInput)
    setReport(data)
    setLoading(false)
    setTab(0)
  }

  const handleSave = async () => {
    if (!report || !user?.uid || saved) return
    setSaving(true)
    try {
      await saveReport(user.uid, report)
      setSaved(true)
      setSnackbar(true)
    } finally {
      setSaving(false)
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
          <Typography
            variant="h3"
            sx={{
              color: '#fff',
              fontSize: { xs: '1.8rem', md: '2.5rem' },
              mb: 0.5,
            }}
          >
            {t('analyze.title')}
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '1rem' }}>
            {t('analyze.subtitle')}
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Demo mode banner */}
        <Alert
          severity="info"
          icon={<CheckCircleIcon />}
          sx={{
            mb: 3,
            borderRadius: 2,
            background: COLORS.fourth,
            color: COLORS.first,
            border: `1px solid ${COLORS.third}`,
            '& .MuiAlert-icon': { color: COLORS.first },
          }}
        >
          <AlertTitle sx={{ fontWeight: 700 }}>{t('analyze.demo_mode')}</AlertTitle>
          {t('analyze.demo_desc')}
        </Alert>

        {/* Search bar */}
        <Card sx={{ mb: 4, p: { xs: 2, md: 3 } }}>
          <Box
            component="form"
            onSubmit={(e) => { e.preventDefault(); handleAnalyze() }}
            sx={{
              display: 'flex',
              gap: 2,
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { sm: 'flex-start' },
            }}
          >
            <TextField
              fullWidth
              value={pageInput}
              onChange={(e) => setPageInput(e.target.value)}
              placeholder={t('analyze.page_input')}
              InputProps={{
                startAdornment: (
                  <FacebookIcon sx={{ color: '#1877f2', mr: 1, fontSize: 22 }} />
                ),
              }}
              sx={{ flex: 1 }}
            />
            <Button
              type="submit"
              variant="contained"
              disabled={loading || !pageInput.trim()}
              startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <SearchIcon />}
              sx={{ minWidth: 160, py: 1.75, whiteSpace: 'nowrap' }}
            >
              {loading ? t('analyze.analyzing') : t('analyze.analyze_btn')}
            </Button>
          </Box>
        </Card>

        {/* Results */}
        {report && (
          <Box>
            {/* Page info + save button */}
            <Card sx={{ mb: 3, p: 3 }}>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                <Avatar
                  src={report.pagePicture}
                  sx={{ width: 64, height: 64, border: `3px solid ${COLORS.fourth}` }}
                >
                  {report.pageName?.[0]}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h5" sx={{ fontSize: '1.3rem' }}>
                    {report.pageName}
                  </Typography>
                  <Chip
                    label={report.pageCategory}
                    size="small"
                    sx={{ mt: 0.5, background: COLORS.fourth, color: COLORS.first, fontWeight: 600 }}
                  />
                </Box>
                <Button
                  variant={saved ? 'outlined' : 'contained'}
                  startIcon={
                    saving
                      ? <CircularProgress size={16} color="inherit" />
                      : saved
                      ? <CheckCircleIcon />
                      : <SaveIcon />
                  }
                  onClick={handleSave}
                  disabled={saving || saved}
                  sx={{
                    ...(saved && {
                      borderColor: '#4caf50',
                      color: '#4caf50',
                    }),
                  }}
                >
                  {saved ? t('analyze.report_saved') : t('analyze.save_report')}
                </Button>
              </Box>
            </Card>

            {/* KPI cards */}
            <Typography variant="h5" sx={{ mb: 2, fontSize: '1.2rem' }}>
              {t('analyze.metrics.title')}
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

            {/* Tabs */}
            <Card sx={{ mb: 3, overflow: 'visible' }}>
              <Tabs
                value={tab}
                onChange={(_, v) => setTab(v)}
                sx={{
                  borderBottom: `1px solid ${COLORS.fourth}`,
                  px: 2,
                  '& .MuiTab-root': {
                    fontFamily: "'Work Sans', sans-serif",
                    fontWeight: 600,
                    textTransform: 'none',
                    fontSize: '0.9rem',
                  },
                  '& .Mui-selected': { color: COLORS.first },
                  '& .MuiTabs-indicator': { background: COLORS.first },
                }}
              >
                <Tab label={t('analyze.engagement_chart')} />
                <Tab label={t('analyze.reach_chart')} />
                <Tab label={t('analyze.top_posts')} />
                <Tab label={t('analyze.recommendations')} />
              </Tabs>
              <CardContent sx={{ p: 3 }}>
                {tab === 0 && (
                  <EngagementChart
                    data={report.dailyMetrics}
                    title={t('analyze.engagement_chart')}
                    type="engagement"
                  />
                )}
                {tab === 1 && (
                  <EngagementChart
                    data={report.dailyMetrics}
                    title={t('analyze.reach_chart')}
                    type="reach"
                  />
                )}
                {tab === 2 && (
                  <Box>
                    <Typography sx={{ fontFamily: "'Fugaz One', cursive", mb: 2, fontSize: '1.1rem' }}>
                      {t('analyze.top_posts')}
                    </Typography>
                    <PostsTable posts={report.topPosts} />
                  </Box>
                )}
                {tab === 3 && (
                  <Box>
                    <Typography sx={{ fontFamily: "'Fugaz One', cursive", mb: 2.5, fontSize: '1.1rem' }}>
                      {t('analyze.recommendations')}
                    </Typography>
                    <Recommendations />
                  </Box>
                )}
              </CardContent>
            </Card>

            {/* All tabs summary on large screen */}
            {tab < 2 && (
              <Grid container spacing={3}>
                <Grid item xs={12} md={7}>
                  <Card sx={{ p: 3 }}>
                    <Typography sx={{ fontFamily: "'Fugaz One', cursive", mb: 2, fontSize: '1.1rem' }}>
                      {t('analyze.top_posts')}
                    </Typography>
                    <PostsTable posts={report.topPosts.slice(0, 3)} />
                  </Card>
                </Grid>
                <Grid item xs={12} md={5}>
                  <Card sx={{ p: 3, height: '100%' }}>
                    <Typography sx={{ fontFamily: "'Fugaz One', cursive", mb: 2, fontSize: '1.1rem' }}>
                      {t('analyze.recommendations')}
                    </Typography>
                    <Recommendations />
                  </Card>
                </Grid>
              </Grid>
            )}
          </Box>
        )}

        {/* Empty state */}
        {!report && !loading && (
          <Box
            sx={{
              textAlign: 'center',
              py: 10,
              background: '#fff',
              borderRadius: 4,
              border: `2px dashed ${COLORS.third}`,
            }}
          >
            <FacebookIcon sx={{ fontSize: 80, color: COLORS.third, mb: 2 }} />
            <Typography variant="h5" sx={{ mb: 1, color: 'text.secondary' }}>
              Entrez une URL de page Facebook
            </Typography>
            <Typography sx={{ color: 'text.secondary', fontSize: '0.9rem' }}>
              Ex: facebook.com/monentreprise ou simplement "monentreprise"
            </Typography>
          </Box>
        )}
      </Container>

      <Snackbar
        open={snackbar}
        autoHideDuration={3000}
        onClose={() => setSnackbar(false)}
        message={t('analyze.report_saved')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  )
}
