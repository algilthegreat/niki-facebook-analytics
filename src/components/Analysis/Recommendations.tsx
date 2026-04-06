import { Box, Card, Typography, Chip } from '@mui/material'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import TagIcon from '@mui/icons-material/Tag'
import ChatIcon from '@mui/icons-material/Chat'
import { useTranslation } from 'react-i18next'
import { COLORS } from '../../theme/theme'
import { alpha } from '@mui/material/styles'

const RECS = [
  {
    key: 'best_time',
    icon: <AccessTimeIcon />,
    color: COLORS.first,
    impact: 'Élevé',
  },
  {
    key: 'content_type',
    icon: <VideoLibraryIcon />,
    color: COLORS.second,
    impact: 'Très élevé',
  },
  {
    key: 'frequency',
    icon: <CalendarMonthIcon />,
    color: '#7c4dff',
    impact: 'Moyen',
  },
  {
    key: 'hashtags',
    icon: <TagIcon />,
    color: '#00bcd4',
    impact: 'Moyen',
  },
  {
    key: 'engagement_tip',
    icon: <ChatIcon />,
    color: '#ff9800',
    impact: 'Élevé',
  },
]

const IMPACT_COLOR: Record<string, string> = {
  'Très élevé': '#4caf50',
  'Élevé': '#ff9800',
  'Moyen': '#2196f3',
}

export default function Recommendations() {
  const { t } = useTranslation()

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {RECS.map((rec) => (
        <Card
          key={rec.key}
          sx={{
            p: 2.5,
            display: 'flex',
            gap: 2,
            alignItems: 'flex-start',
            borderLeft: `4px solid ${rec.color}`,
            '&:hover': { transform: 'translateX(4px)' },
            transition: 'transform 0.2s',
          }}
        >
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: 2.5,
              background: alpha(rec.color, 0.12),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: rec.color,
              flexShrink: 0,
            }}
          >
            {rec.icon}
          </Box>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5, flexWrap: 'wrap' }}>
              <Typography
                sx={{
                  fontFamily: "'Fugaz One', cursive",
                  fontSize: '0.95rem',
                  color: 'text.primary',
                }}
              >
                {t(`recommendations.${rec.key}`)}
              </Typography>
              <Chip
                label={rec.impact}
                size="small"
                sx={{
                  height: 20,
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  background: alpha(IMPACT_COLOR[rec.impact], 0.12),
                  color: IMPACT_COLOR[rec.impact],
                }}
              />
            </Box>
            <Typography
              sx={{
                fontSize: '0.85rem',
                color: 'text.secondary',
                lineHeight: 1.5,
              }}
            >
              {t(`recommendations.${rec.key}_desc`)}
            </Typography>
          </Box>
        </Card>
      ))}
    </Box>
  )
}
