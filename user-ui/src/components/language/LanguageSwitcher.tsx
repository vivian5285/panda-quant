import React from 'react';
import { Button, Menu, MenuItem, Box, Typography, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import LanguageIcon from '@mui/icons-material/Language';
import CheckIcon from '@mui/icons-material/Check';

interface LanguageSwitcherProps {
  onLanguageChange?: (lang: string) => void;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ onLanguageChange }) => {
  const { i18n } = useTranslation();
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageChange = async (lang: string) => {
    try {
      await i18n.changeLanguage(lang);
      localStorage.setItem('i18nextLng', lang);
      onLanguageChange?.(lang);
      handleClose();
    } catch (error) {
      console.error('Failed to change language:', error);
    }
  };

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'ko', name: '한국어', flag: '🇰🇷' },
  ];

  const currentLanguage = languages.find(lang => lang.code === i18n.language);

  return (
    <Box>
      <Button
        startIcon={<LanguageIcon sx={{ color: theme.palette.primary.main }} />}
        onClick={handleClick}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          textTransform: 'none',
          color: theme.palette.mode === 'dark' ? theme.palette.common.white : theme.palette.text.primary,
          background: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
          borderRadius: 2,
          px: 2,
          py: 1,
          '&:hover': {
            background: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.06)',
          },
        }}
      >
        <Typography 
          variant="body1" 
          sx={{ 
            display: { xs: 'none', sm: 'block' },
            fontWeight: 500,
          }}
        >
          {currentLanguage?.name || 'Language'}
        </Typography>
        <Typography variant="body1">
          {currentLanguage?.flag || '🌐'}
        </Typography>
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          elevation: 3,
          sx: {
            background: theme.palette.mode === 'dark' 
              ? 'rgba(45, 45, 45, 0.95)' 
              : 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            minWidth: 200,
            borderRadius: 2,
            border: `1px solid ${
              theme.palette.mode === 'dark' 
                ? 'rgba(255, 255, 255, 0.1)' 
                : 'rgba(0, 0, 0, 0.1)'
            }`,
          },
        }}
      >
        {languages.map((lang) => (
          <MenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            selected={i18n.language === lang.code}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              py: 1.5,
              px: 2,
              borderRadius: 1,
              mx: 0.5,
              my: 0.25,
              color: theme.palette.mode === 'dark' ? theme.palette.common.white : theme.palette.text.primary,
              '&:hover': {
                background: theme.palette.mode === 'dark' 
                  ? 'rgba(255, 255, 255, 0.1)' 
                  : 'rgba(0, 0, 0, 0.04)',
              },
              '&.Mui-selected': {
                background: theme.palette.mode === 'dark' 
                  ? 'rgba(255, 255, 255, 0.15)' 
                  : 'rgba(0, 0, 0, 0.08)',
                '&:hover': {
                  background: theme.palette.mode === 'dark' 
                    ? 'rgba(255, 255, 255, 0.2)' 
                    : 'rgba(0, 0, 0, 0.12)',
                },
              },
            }}
          >
            <Typography variant="body1" sx={{ minWidth: 24 }}>
              {lang.flag}
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                flexGrow: 1,
                fontWeight: i18n.language === lang.code ? 500 : 400,
              }}
            >
              {lang.name}
            </Typography>
            {i18n.language === lang.code && (
              <CheckIcon 
                fontSize="small" 
                sx={{ 
                  color: theme.palette.primary.main,
                  animation: 'fadeIn 0.3s ease-in-out',
                  '@keyframes fadeIn': {
                    '0%': { opacity: 0, transform: 'scale(0.8)' },
                    '100%': { opacity: 1, transform: 'scale(1)' },
                  },
                }} 
              />
            )}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default LanguageSwitcher; 