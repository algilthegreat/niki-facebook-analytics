import { Box, CircularProgress, Typography } from '@mui/material'
import { COLORS } from '../../theme/theme'
import Logo from './Logo'

export default function LoadingScreen() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: `linear-gradient(135deg, ${COLORS.fourth} 0%, #fff 100%)`,
        gap: 3,
      }}
    >
      <Logo size="large" />
      <CircularProgress
        size={40}
        sx={{ color: COLORS.first, mt: 1 }}
      />
      <Typography
        sx={{
          color: COLORS.second,
          fontWeight: 500,
          fontFamily: "'Work Sans', sans-serif",
        }}
      >
        Chargement...
      </Typography>
    </Box>
  )
}
