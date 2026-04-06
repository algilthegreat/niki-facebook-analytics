import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  useMediaQuery,
  useTheme,
  Typography,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import DashboardIcon from '@mui/icons-material/Dashboard'
import BarChartIcon from '@mui/icons-material/BarChart'
import AssessmentIcon from '@mui/icons-material/Assessment'
import LogoutIcon from '@mui/icons-material/Logout'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '../../store/authStore'
import Logo from '../Common/Logo'
import LanguageSwitcher from '../Common/LanguageSwitcher'
import { COLORS } from '../../theme/theme'

const NAV_LINKS = [
  { key: 'dashboard', path: '/dashboard', icon: <DashboardIcon /> },
  { key: 'analyze', path: '/analyze', icon: <BarChartIcon /> },
  { key: 'reports', path: '/reports', icon: <AssessmentIcon /> },
]

export default function Navbar() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const { user, logout } = useAuthStore()

  const [drawerOpen, setDrawerOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleLogout = async () => {
    setAnchorEl(null)
    await logout()
    navigate('/')
  }

  const isActive = (path: string) => location.pathname === path

  return (
    <AppBar
      position="sticky"
      sx={{
        background: '#fff',
        color: 'text.primary',
        borderBottom: `1px solid ${COLORS.fourth}`,
      }}
      elevation={0}
    >
      <Toolbar sx={{ px: { xs: 2, md: 4 }, gap: 2 }}>
        <Box component={Link} to={user ? '/dashboard' : '/'} sx={{ textDecoration: 'none', flexGrow: { xs: 1, md: 0 }, mr: { md: 4 } }}>
          <Logo size="small" />
        </Box>

        {!isMobile && user && (
          <Box sx={{ display: 'flex', gap: 0.5, flexGrow: 1 }}>
            {NAV_LINKS.map((link) => (
              <Button
                key={link.key}
                component={Link}
                to={link.path}
                startIcon={link.icon}
                sx={{
                  color: isActive(link.path) ? COLORS.first : 'text.secondary',
                  fontWeight: isActive(link.path) ? 700 : 500,
                  borderRadius: 2,
                  px: 2,
                  background: isActive(link.path) ? COLORS.fourth : 'transparent',
                  '&:hover': { background: COLORS.fourth, color: COLORS.first },
                  transition: 'all 0.2s',
                }}
              >
                {t(`nav.${link.key}`)}
              </Button>
            ))}
          </Box>
        )}

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 'auto' }}>
          <LanguageSwitcher />
          {user ? (
            <>
              <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ p: 0.5 }}>
                <Avatar
                  src={user.photoURL || undefined}
                  sx={{
                    width: 36,
                    height: 36,
                    background: `linear-gradient(135deg, ${COLORS.first}, ${COLORS.second})`,
                    fontSize: '0.9rem',
                    fontWeight: 700,
                  }}
                >
                  {user.displayName?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}
                </Avatar>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
                PaperProps={{ sx: { mt: 0.5, minWidth: 180, borderRadius: 2 } }}
              >
                <Box sx={{ px: 2, py: 1.5 }}>
                  <Typography sx={{ fontWeight: 600, fontSize: '0.9rem' }}>
                    {user.displayName || 'Utilisateur'}
                  </Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                    {user.email}
                  </Typography>
                </Box>
                <Divider />
                <MenuItem onClick={handleLogout} sx={{ gap: 1.5, color: 'error.main', mt: 0.5 }}>
                  <LogoutIcon fontSize="small" />
                  {t('nav.logout')}
                </MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button component={Link} to="/login" variant="outlined" sx={{ borderColor: COLORS.first, color: COLORS.first, '&:hover': { borderColor: COLORS.second, background: COLORS.fourth } }}>
                {t('nav.login')}
              </Button>
              <Button component={Link} to="/register" variant="contained">
                {t('nav.register')}
              </Button>
            </>
          )}
          {isMobile && user && (
            <IconButton onClick={() => setDrawerOpen(true)}>
              <MenuIcon />
            </IconButton>
          )}
        </Box>
      </Toolbar>

      {/* Mobile Drawer */}
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 260, pt: 2 }}>
          <Box sx={{ px: 2, pb: 2 }}>
            <Logo size="small" />
          </Box>
          <Divider />
          <List>
            {NAV_LINKS.map((link) => (
              <ListItem key={link.key} disablePadding>
                <ListItemButton
                  component={Link}
                  to={link.path}
                  onClick={() => setDrawerOpen(false)}
                  selected={isActive(link.path)}
                  sx={{
                    '&.Mui-selected': {
                      background: COLORS.fourth,
                      color: COLORS.first,
                      '& .MuiListItemIcon-root': { color: COLORS.first },
                    },
                  }}
                >
                  <ListItemIcon>{link.icon}</ListItemIcon>
                  <ListItemText primary={t(`nav.${link.key}`)} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider />
          <List>
            <ListItem disablePadding>
              <ListItemButton onClick={handleLogout} sx={{ color: 'error.main' }}>
                <ListItemIcon><LogoutIcon color="error" /></ListItemIcon>
                <ListItemText primary={t('nav.logout')} />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </AppBar>
  )
}
