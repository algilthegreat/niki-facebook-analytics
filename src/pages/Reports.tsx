import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Box,
  Button,
  Container,
  Typography,
  Card,
  TextField,
  InputAdornment,
  Avatar,
  Chip,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Skeleton,
  Divider,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import DeleteIcon from '@mui/icons-material/Delete'
import VisibilityIcon from '@mui/icons-material/Visibility'
import AddIcon from '@mui/icons-material/Add'
import AssessmentIcon from '@mui/icons-material/Assessment'
import { useTranslation } from 'react-i18next'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import Navbar from '../components/Layout/Navbar'
import { useAuthStore } from '../store/authStore'
import { useReportsStore, Report } from '../store/reportsStore'
import { COLORS } from '../theme/theme'

export default function Reports() {
  const { t } = useTranslation()
  const { user } = useAuthStore()
  const { reports, loading, fetchReports, deleteReport } = useReportsStore()

  const [search, setSearch] = useState('')
  const [deleteTarget, setDeleteTarget] = useState<Report | null>(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (user?.uid) fetchReports(user.uid)
  }, [user, fetchReports])

  const filtered = reports.filter((r) =>
    r.pageName?.toLowerCase().includes(search.toLowerCase())
  )

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
      return format(d, 'dd MMMM yyyy', { locale: fr })
    } catch {
      return '—'
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget || !user?.uid) return
    setDeleting(true)
    try {
      await deleteReport(user.uid, deleteTarget.id)
    } finally {
      setDeleting(false)
      setDeleteTarget(null)
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
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Typography variant="h3" sx={{ color: '#fff', fontSize: { xs: '1.8rem', md: '2.5rem' } }}>
                {t('reports.title')}
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.8)', mt: 0.5 }}>
                {t('reports.subtitle')}
              </Typography>
            </Box>
            <Button
              component={Link}
              to="/analyze"
              variant="contained"
              startIcon={<AddIcon />}
              sx={{ background: '#fff', color: COLORS.first, fontWeight: 700, '&:hover': { background: COLORS.fourth } }}
            >
              {t('dashboard.new_analysis')}
            </Button>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Search */}
        <Card sx={{ p: 2, mb: 4 }}>
          <TextField
            fullWidth
            placeholder={t('reports.search')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              ),
            }}
            size="small"
          />
        </Card>

        {/* Loading */}
        {loading ? (
          <Grid container spacing={2}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Grid item xs={12} sm={6} md={4} key={i}>
                <Skeleton variant="rounded" height={200} sx={{ borderRadius: 3 }} />
              </Grid>
            ))}
          </Grid>
        ) : filtered.length === 0 ? (
          <Box
            sx={{
              textAlign: 'center',
              py: 10,
              background: '#fff',
              borderRadius: 4,
              border: `2px dashed ${COLORS.third}`,
            }}
          >
            <AssessmentIcon sx={{ fontSize: 72, color: COLORS.third, mb: 2 }} />
            <Typography variant="h6" sx={{ color: 'text.secondary', mb: 1 }}>
              {search ? t('reports.no_results') : t('dashboard.no_reports')}
            </Typography>
            {!search && (
              <>
                <Typography sx={{ color: 'text.secondary', fontSize: '0.9rem', mb: 3 }}>
                  {t('dashboard.no_reports_desc')}
                </Typography>
                <Button component={Link} to="/analyze" variant="contained" startIcon={<AddIcon />}>
                  {t('dashboard.analyze_now')}
                </Button>
              </>
            )}
          </Box>
        ) : (
          <Grid container spacing={2.5}>
            {filtered.map((report) => (
              <Grid item xs={12} sm={6} md={4} key={report.id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    '&:hover': { transform: 'translateY(-3px)' },
                    transition: 'transform 0.2s',
                  }}
                >
                  <Box sx={{ p: 2.5, flex: 1 }}>
                    <Box sx={{ display: 'flex', gap: 1.5, mb: 2 }}>
                      <Avatar
                        src={report.pagePicture}
                        sx={{ width: 48, height: 48, border: `2px solid ${COLORS.fourth}` }}
                      >
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
                      <Chip
                        label={report.pageCategory || 'Page'}
                        size="small"
                        sx={{
                          background: COLORS.fourth,
                          color: COLORS.first,
                          fontSize: '0.65rem',
                          fontWeight: 700,
                          height: 22,
                          flexShrink: 0,
                        }}
                      />
                    </Box>

                    <Divider sx={{ mb: 2 }} />

                    <Grid container spacing={1}>
                      {[
                        { label: t('reports.fans'), val: report.fans?.toLocaleString('fr-FR'), color: COLORS.first },
                        { label: t('reports.reach'), val: report.reach?.toLocaleString('fr-FR'), color: COLORS.second },
                        { label: t('reports.engagement'), val: `${report.engagement}%`, color: '#7c4dff' },
                      ].map((m) => (
                        <Grid item xs={4} key={m.label}>
                          <Box sx={{ textAlign: 'center', p: 1, background: '#fafafa', borderRadius: 2 }}>
                            <Typography
                              sx={{
                                fontFamily: "'Fugaz One', cursive",
                                fontSize: '0.95rem',
                                color: m.color,
                                lineHeight: 1.2,
                              }}
                            >
                              {m.val}
                            </Typography>
                            <Typography sx={{ fontSize: '0.65rem', color: 'text.secondary', mt: 0.25 }}>
                              {m.label}
                            </Typography>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>

                  <Divider />
                  <Box sx={{ px: 2, py: 1.5, display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                    <IconButton
                      size="small"
                      onClick={() => setDeleteTarget(report)}
                      sx={{ color: 'error.main', '&:hover': { background: '#ffebee' } }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                    <Button
                      component={Link}
                      to={`/reports/${report.id}`}
                      size="small"
                      variant="contained"
                      startIcon={<VisibilityIcon />}
                      sx={{ fontSize: '0.8rem', py: 0.5 }}
                    >
                      {t('reports.view')}
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      {/* Delete confirmation */}
      <Dialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
      >
        <DialogTitle sx={{ fontFamily: "'Fugaz One', cursive" }}>
          {t('reports.confirm_delete')}
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: 'text.secondary' }}>
            {t('reports.delete_desc')}
          </Typography>
          {deleteTarget && (
            <Box sx={{ mt: 2, p: 2, background: '#fafafa', borderRadius: 2 }}>
              <Typography sx={{ fontWeight: 700 }}>{deleteTarget.pageName}</Typography>
              <Typography sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>
                {formatDate(deleteTarget.createdAt)}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ pb: 2, px: 2, gap: 1 }}>
          <Button onClick={() => setDeleteTarget(null)} variant="outlined">
            {t('reports.cancel')}
          </Button>
          <Button
            onClick={handleDelete}
            variant="contained"
            color="error"
            disabled={deleting}
          >
            {deleting ? '...' : t('reports.confirm')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
