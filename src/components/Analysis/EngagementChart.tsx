import { Box, Typography, useTheme } from '@mui/material'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { format, parseISO } from 'date-fns'
import { fr } from 'date-fns/locale'
import { DailyMetric } from '../../store/reportsStore'
import { COLORS } from '../../theme/theme'

interface EngagementChartProps {
  data: DailyMetric[]
  title: string
  type?: 'engagement' | 'reach'
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number; name: string; color: string }[]; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <Box
      sx={{
        background: '#fff',
        border: `1px solid ${COLORS.fourth}`,
        borderRadius: 2,
        p: 1.5,
        boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
      }}
    >
      <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', mb: 0.5 }}>
        {label}
      </Typography>
      {payload.map((item) => (
        <Typography key={item.name} sx={{ fontSize: '0.85rem', fontWeight: 600, color: item.color }}>
          {item.name}: {item.value.toLocaleString('fr-FR')}
        </Typography>
      ))}
    </Box>
  )
}

export default function EngagementChart({ data, title, type = 'engagement' }: EngagementChartProps) {
  const theme = useTheme()

  const chartData = data.map((d) => ({
    ...d,
    dateLabel: (() => {
      try {
        return format(parseISO(d.date), 'dd MMM', { locale: fr })
      } catch {
        return d.date
      }
    })(),
  }))

  // Show every 4th label to avoid crowding
  const tickFormatter = (_: string, index: number) =>
    index % 4 === 0 ? chartData[index]?.dateLabel || '' : ''

  return (
    <Box sx={{ width: '100%' }}>
      <Typography
        sx={{ fontFamily: "'Fugaz One', cursive", mb: 2, fontSize: '1.1rem', color: 'text.primary' }}
      >
        {title}
      </Typography>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="gradEngagement" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={COLORS.first} stopOpacity={0.3} />
              <stop offset="95%" stopColor={COLORS.first} stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradReach" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={COLORS.second} stopOpacity={0.3} />
              <stop offset="95%" stopColor={COLORS.second} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
          <XAxis
            dataKey="dateLabel"
            tickFormatter={tickFormatter}
            tick={{ fontSize: 11, fill: theme.palette.text.secondary }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: theme.palette.text.secondary }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: '0.8rem', fontFamily: "'Work Sans', sans-serif" }}
          />
          {type === 'engagement' ? (
            <Area
              type="monotone"
              dataKey="engagement"
              name="Engagement"
              stroke={COLORS.first}
              strokeWidth={2.5}
              fill="url(#gradEngagement)"
              dot={false}
              activeDot={{ r: 5, fill: COLORS.first }}
            />
          ) : (
            <>
              <Area
                type="monotone"
                dataKey="reach"
                name="Portée"
                stroke={COLORS.first}
                strokeWidth={2.5}
                fill="url(#gradEngagement)"
                dot={false}
                activeDot={{ r: 5, fill: COLORS.first }}
              />
              <Area
                type="monotone"
                dataKey="impressions"
                name="Impressions"
                stroke={COLORS.second}
                strokeWidth={2}
                fill="url(#gradReach)"
                dot={false}
                activeDot={{ r: 4, fill: COLORS.second }}
              />
            </>
          )}
        </AreaChart>
      </ResponsiveContainer>
    </Box>
  )
}
