import { useState } from 'react'
import { Button, Menu, MenuItem, Box } from '@mui/material'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import { useTranslation } from 'react-i18next'

const LANGUAGES = [
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'lo', label: 'ລາວ', flag: '🇱🇦' },
]

interface LanguageSwitcherProps {
  white?: boolean
}

export default function LanguageSwitcher({ white = false }: LanguageSwitcherProps) {
  const { i18n } = useTranslation()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const current = LANGUAGES.find((l) => l.code === i18n.language) || LANGUAGES[0]

  const handleChange = (code: string) => {
    i18n.changeLanguage(code)
    setAnchorEl(null)
  }

  return (
    <>
      <Button
        onClick={(e) => setAnchorEl(e.currentTarget)}
        endIcon={<KeyboardArrowDownIcon />}
        sx={{
          color: white ? '#fff' : 'text.primary',
          fontWeight: 500,
          minWidth: 0,
          px: 1.5,
          py: 0.75,
          borderRadius: 2,
          fontSize: '0.875rem',
          '&:hover': { background: white ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.05)' },
        }}
      >
        <Box component="span" sx={{ mr: 0.5 }}>{current.flag}</Box>
        {current.code.toUpperCase()}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        PaperProps={{ sx: { mt: 0.5, minWidth: 140, borderRadius: 2 } }}
      >
        {LANGUAGES.map((lang) => (
          <MenuItem
            key={lang.code}
            onClick={() => handleChange(lang.code)}
            selected={lang.code === i18n.language}
            sx={{ gap: 1.5, fontSize: '0.9rem', fontFamily: "'Work Sans', sans-serif" }}
          >
            <span>{lang.flag}</span>
            {lang.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}
