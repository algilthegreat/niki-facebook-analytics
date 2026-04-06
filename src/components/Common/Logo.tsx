import { Box, Typography } from '@mui/material'
import { COLORS } from '../../theme/theme'

interface LogoProps {
  size?: 'small' | 'medium' | 'large'
  white?: boolean
}

export default function Logo({ size = 'medium', white = false }: LogoProps) {
  const sizes = { small: 28, medium: 36, large: 56 }
  const fontSize = { small: '1.1rem', medium: '1.4rem', large: '2.2rem' }
  const dim = sizes[size]

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, textDecoration: 'none' }}>
      <Box
        sx={{
          width: dim,
          height: dim,
          borderRadius: '50%',
          background: white
            ? 'rgba(255,255,255,0.2)'
            : `linear-gradient(135deg, ${COLORS.first} 0%, ${COLORS.second} 100%)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: white ? 'none' : `0 4px 15px rgba(255,0,123,0.4)`,
          flexShrink: 0,
        }}
      >
        <Typography
          sx={{
            fontFamily: "'Fugaz One', cursive",
            color: '#fff',
            fontSize: dim * 0.45,
            lineHeight: 1,
            userSelect: 'none',
          }}
        >
          N
        </Typography>
      </Box>
      <Typography
        sx={{
          fontFamily: "'Fugaz One', cursive",
          fontSize: fontSize[size],
          color: white ? '#fff' : COLORS.first,
          letterSpacing: '0.08em',
          userSelect: 'none',
        }}
      >
        NIKI
      </Typography>
    </Box>
  )
}
