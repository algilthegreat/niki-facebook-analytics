import { createTheme, alpha } from '@mui/material/styles'

declare module '@mui/material/styles' {
  interface Palette {
    niki: {
      first: string
      second: string
      third: string
      fourth: string
    }
  }
  interface PaletteOptions {
    niki?: {
      first: string
      second: string
      third: string
      fourth: string
    }
  }
}

export const COLORS = {
  first: '#ff007b',
  second: '#ff5757',
  third: '#ff8585',
  fourth: '#ffebeb',
}

export const theme = createTheme({
  palette: {
    primary: {
      main: COLORS.first,
      light: COLORS.third,
      dark: '#cc005f',
      contrastText: '#ffffff',
    },
    secondary: {
      main: COLORS.second,
      light: COLORS.fourth,
      dark: '#cc3333',
      contrastText: '#ffffff',
    },
    background: {
      default: '#fafafa',
      paper: '#ffffff',
    },
    niki: {
      first: COLORS.first,
      second: COLORS.second,
      third: COLORS.third,
      fourth: COLORS.fourth,
    },
  },
  typography: {
    fontFamily: "'Work Sans', sans-serif",
    h1: {
      fontFamily: "'Fugaz One', cursive",
      fontWeight: 400,
      letterSpacing: '0.02em',
    },
    h2: {
      fontFamily: "'Fugaz One', cursive",
      fontWeight: 400,
      letterSpacing: '0.02em',
    },
    h3: {
      fontFamily: "'Fugaz One', cursive",
      fontWeight: 400,
      letterSpacing: '0.02em',
    },
    h4: {
      fontFamily: "'Fugaz One', cursive",
      fontWeight: 400,
    },
    h5: {
      fontFamily: "'Fugaz One', cursive",
      fontWeight: 400,
    },
    h6: {
      fontFamily: "'Fugaz One', cursive",
      fontWeight: 400,
    },
    button: {
      fontFamily: "'Work Sans', sans-serif",
      fontWeight: 600,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 30,
          padding: '10px 28px',
          fontSize: '0.95rem',
          fontWeight: 600,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: `0 4px 20px ${alpha(COLORS.first, 0.35)}`,
          },
        },
        containedPrimary: {
          background: `linear-gradient(135deg, ${COLORS.first} 0%, ${COLORS.second} 100%)`,
          '&:hover': {
            background: `linear-gradient(135deg, #cc005f 0%, #cc3333 100%)`,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 2px 20px rgba(0,0,0,0.08)',
          transition: 'box-shadow 0.2s ease, transform 0.2s ease',
          '&:hover': {
            boxShadow: '0 8px 40px rgba(0,0,0,0.12)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontFamily: "'Work Sans', sans-serif",
          fontWeight: 600,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: COLORS.first,
            },
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: COLORS.first,
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 20px rgba(0,0,0,0.08)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: 'none',
          boxShadow: '2px 0 20px rgba(0,0,0,0.08)',
        },
      },
    },
  },
})
