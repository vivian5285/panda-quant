import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  useTheme
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { themeUtils } from '../../theme';

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const languages = [
    { code: 'zh', label: '中文' },
    { code: 'en', label: 'English' },
  ];

  const handleLanguageChange = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
    setAnchorEl(null);
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        setAnchorEl(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <Box sx={{ position: 'relative' }}>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <IconButton
          ref={buttonRef}
          onClick={handleClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          sx={{
            color: theme.palette.text.primary,
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: themeUtils.createGradient(
                theme.palette.primary.main,
                theme.palette.secondary.main
              ),
              opacity: 0,
              transition: 'opacity 0.3s ease',
            },
            '&:hover::before': {
              opacity: 0.1,
            },
          }}
        >
          <Typography
            variant="body1"
            sx={{
              fontWeight: 600,
              background: themeUtils.createTextGradient(
                theme.palette.primary.main,
                theme.palette.secondary.main
              ),
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {languages.find(lang => lang.code === i18n.language)?.label || 'EN'}
          </Typography>
        </IconButton>
      </motion.div>

      <AnimatePresence>
        {anchorEl && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              PaperProps={{
                sx: {
                  mt: 1,
                  ...themeUtils.glassEffect(0.8),
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${theme.palette.border.main}`,
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  minWidth: 120,
                },
              }}
            >
              {languages.map((language) => (
                <MenuItem
                  key={language.code}
                  onClick={() => handleLanguageChange(language.code)}
                  selected={i18n.language === language.code}
                  sx={{
                    py: 1,
                    px: 2,
                    '&:hover': {
                      background: themeUtils.createGradient(
                        theme.palette.primary.main,
                        theme.palette.secondary.main
                      ),
                    },
                    '&.Mui-selected': {
                      background: themeUtils.createGradient(
                        theme.palette.primary.main,
                        theme.palette.secondary.main
                      ),
                      '&:hover': {
                        background: themeUtils.createGradient(
                          theme.palette.primary.main,
                          theme.palette.secondary.main
                        ),
                      },
                    },
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: i18n.language === language.code ? 600 : 400,
                      color: theme.palette.text.primary,
                    }}
                  >
                    {language.label}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
};

export default LanguageSwitcher; 