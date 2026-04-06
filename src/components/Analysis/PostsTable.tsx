import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  useTheme,
  useMediaQuery,
  Card,
} from '@mui/material'
import ThumbUpIcon from '@mui/icons-material/ThumbUp'
import ChatBubbleIcon from '@mui/icons-material/ChatBubble'
import ShareIcon from '@mui/icons-material/Share'
import VisibilityIcon from '@mui/icons-material/Visibility'
import { useTranslation } from 'react-i18next'
import { PostMetric } from '../../store/reportsStore'
import { COLORS } from '../../theme/theme'
import { format, parseISO } from 'date-fns'
import { fr } from 'date-fns/locale'

interface PostsTableProps {
  posts: PostMetric[]
}

export default function PostsTable({ posts }: PostsTableProps) {
  const { t } = useTranslation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const formatDate = (dateStr: string) => {
    try {
      return format(parseISO(dateStr), 'dd MMM yyyy', { locale: fr })
    } catch {
      return dateStr
    }
  }

  if (isMobile) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {posts.map((post, i) => (
          <Card key={post.id} sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Chip
                label={`#${i + 1}`}
                size="small"
                sx={{ background: COLORS.fourth, color: COLORS.first, fontWeight: 700 }}
              />
              <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                {formatDate(post.created_time)}
              </Typography>
            </Box>
            <Typography
              sx={{
                fontSize: '0.875rem',
                mb: 1.5,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {post.message || '—'}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              {[
                { icon: <ThumbUpIcon sx={{ fontSize: 14 }} />, val: post.likes, color: COLORS.first },
                { icon: <ChatBubbleIcon sx={{ fontSize: 14 }} />, val: post.comments, color: COLORS.second },
                { icon: <ShareIcon sx={{ fontSize: 14 }} />, val: post.shares, color: COLORS.third },
                { icon: <VisibilityIcon sx={{ fontSize: 14 }} />, val: post.reach, color: '#666' },
              ].map((item, idx) => (
                <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: item.color }}>
                  {item.icon}
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 600 }}>
                    {(item.val || 0).toLocaleString('fr-FR')}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Card>
        ))}
      </Box>
    )
  }

  return (
    <TableContainer sx={{ borderRadius: 2, border: `1px solid ${COLORS.fourth}` }}>
      <Table size="small">
        <TableHead>
          <TableRow sx={{ background: COLORS.fourth }}>
            {['#', t('analyze.post_columns.message'), t('analyze.post_columns.likes'), t('analyze.post_columns.comments'), t('analyze.post_columns.shares'), t('analyze.post_columns.reach'), t('analyze.post_columns.date')].map((h) => (
              <TableCell
                key={h}
                sx={{
                  fontFamily: "'Work Sans', sans-serif",
                  fontWeight: 700,
                  fontSize: '0.78rem',
                  color: COLORS.first,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  py: 1.5,
                }}
              >
                {h}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {posts.map((post, i) => (
            <TableRow
              key={post.id}
              sx={{
                '&:hover': { background: `${COLORS.fourth}50` },
                '&:last-child td': { border: 0 },
              }}
            >
              <TableCell>
                <Chip
                  label={i + 1}
                  size="small"
                  sx={{
                    minWidth: 28,
                    height: 24,
                    background: i === 0 ? COLORS.first : i === 1 ? COLORS.second : COLORS.third,
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: '0.75rem',
                  }}
                />
              </TableCell>
              <TableCell sx={{ maxWidth: 280 }}>
                <Typography
                  sx={{
                    fontSize: '0.82rem',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {post.message || '—'}
                </Typography>
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: COLORS.first }}>
                  <ThumbUpIcon sx={{ fontSize: 14 }} />
                  <Typography sx={{ fontSize: '0.85rem', fontWeight: 600 }}>
                    {(post.likes || 0).toLocaleString('fr-FR')}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: COLORS.second }}>
                  <ChatBubbleIcon sx={{ fontSize: 14 }} />
                  <Typography sx={{ fontSize: '0.85rem', fontWeight: 600 }}>
                    {(post.comments || 0).toLocaleString('fr-FR')}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: COLORS.third }}>
                  <ShareIcon sx={{ fontSize: 14 }} />
                  <Typography sx={{ fontSize: '0.85rem', fontWeight: 600 }}>
                    {(post.shares || 0).toLocaleString('fr-FR')}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Typography sx={{ fontSize: '0.85rem', fontWeight: 600 }}>
                  {(post.reach || 0).toLocaleString('fr-FR')}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography sx={{ fontSize: '0.8rem', color: 'text.secondary', whiteSpace: 'nowrap' }}>
                  {formatDate(post.created_time)}
                </Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
