import { Box, Card, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'
import { COLORS } from '../../theme/theme'

interface MetricCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  color?: string
  trend?: number
  suffix?: string
}

export default function MetricCard({
  title,
  value,
  icon,
  color = COLORS.first,
  trend,
  suffix = '',
}: MetricCardProps) {
  return (
    <Card
      sx={{
        p: 3,
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'default',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          right: 0,
          width: 100,
          height: 100,
          borderRadius: '50%',
          background: alpha(color, 0.08),
          transform: 'translate(30px, -30px)',
        },
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography
            sx={{
              fontSize: '0.8rem',
              fontWeight: 600,
              color: 'text.secondary',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              mb: 1,
            }}
          >
            {title}
          </Typography>
          <Typography
            variant="h4"
            sx={{
              fontFamily: "'Fugaz One', cursive",
              color: 'text.primary',
              lineHeight: 1.1,
            }}
          >
            {typeof value === 'number' ? value.toLocaleString('fr-FR') : value}
            {suffix && (
              <Typography component="span" sx={{ fontSize: '1rem', color: 'text.secondary', ml: 0.5 }}>
                {suffix}
              </Typography>
            )}
          </Typography>
          {trend !== undefined && (
            <Typography
              sx={{
                mt: 1,
                fontSize: '0.8rem',
                fontWeight: 600,
                color: trend >= 0 ? '#4caf50' : '#f44336',
              }}
            >
              {trend >= 0 ? '+' : ''}{trend}% ce mois
            </Typography>
          )}
        </Box>
        <Box
          sx={{
            width: 50,
            height: 50,
            borderRadius: 3,
            background: alpha(color, 0.12),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color,
            '& svg': { fontSize: 26 },
          }}
        >
          {icon}
        </Box>
      </Box>
    </Card>
  )
}
