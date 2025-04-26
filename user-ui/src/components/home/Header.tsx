import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useTheme,
  useMediaQuery,
  Menu,
  MenuItem,
  Typography,
  Container,
  Stack,
  Paper,
  alpha
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu as MenuIcon,
  Language as LanguageIcon,
  AccountCircle as AccountIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { themeUtils } from '../../theme';
import LanguageSwitcher from '../common/LanguageSwitcher';
import { useLocation } from 'react-router-dom';

const Header: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [languageAnchor, setLanguageAnchor] = useState<null | HTMLElement>(null);
  const { t, i18n } = useTranslation();
  const location = useLocation();

  const isHomePage = location.pathname === '/';

  const navItems = isHomePage ? [
    { label: t('nav.products'), href: '#products' },
    { label: t('nav.performance'), href: '#performance' },
    { label: t('nav.strategies'), href: '#strategies' },
    { label: t('nav.security'), href: '#security' },
    { label: t('nav.referral'), href: '#referral' },
  ] : [
    { label: t('nav.home'), href: '/' },
    { label: t('nav.dashboard'), href: '/dashboard' },
    { label: t('nav.wallet'), href: '/wallet' },
    { label: t('nav.settings'), href: '/settings' },
  ];

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'zh', name: '中文' },
    { code: 'ja', name: '日本語' },
    { code: 'ko', name: '한국어' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
    { code: 'it', name: 'Italiano' },
    { code: 'pt', name: 'Português' },
    { code: 'ru', name: 'Русский' },
    { code: 'ar', name: 'العربية' },
    { code: 'hi', name: 'हिन्दी' },
    { code: 'bn', name: 'বাংলা' },
    { code: 'pa', name: 'ਪੰਜਾਬੀ' },
    { code: 'ta', name: 'தமிழ்' },
    { code: 'te', name: 'తెలుగు' },
    { code: 'mr', name: 'मराठी' },
    { code: 'gu', name: 'ગુજરાતી' },
    { code: 'kn', name: 'ಕನ್ನಡ' },
    { code: 'ml', name: 'മലയാളം' },
    { code: 'th', name: 'ไทย' },
    { code: 'vi', name: 'Tiếng Việt' },
    { code: 'id', name: 'Bahasa Indonesia' },
    { code: 'ms', name: 'Bahasa Melayu' },
    { code: 'tr', name: 'Türkçe' },
    { code: 'pl', name: 'Polski' },
    { code: 'uk', name: 'Українська' },
    { code: 'ro', name: 'Română' },
    { code: 'nl', name: 'Nederlands' },
    { code: 'sv', name: 'Svenska' },
  ];

  const handleLanguageClick = (event: React.MouseEvent<HTMLElement>) => {
    setLanguageAnchor(event.currentTarget);
  };

  const handleLanguageClose = () => {
    setLanguageAnchor(null);
  };

  const handleLanguageChange = (code: string) => {
    i18n.changeLanguage(code);
    handleLanguageClose();
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const Logo = () => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <motion.div
        animate={{
          rotate: [0, 10, -10, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: themeUtils.animationConfig.duration.slow,
          repeat: Infinity,
          repeatDelay: 3,
        }}
      >
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            background: themeUtils.createGradient(
              theme.palette.primary.main,
              theme.palette.secondary.main
            ),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 0 20px ${alpha(theme.palette.primary.main, 0.5)}`,
            position: 'relative',
            '&::after': {
              content: '""',
              position: 'absolute',
              inset: -2,
              borderRadius: '50%',
              background: themeUtils.createGradient(
                theme.palette.primary.main,
                theme.palette.secondary.main
              ),
              zIndex: -1,
              filter: 'blur(8px)',
              opacity: 0.5,
            },
          }}
        >
          <img
            src="/panda-logo.png"
            alt="PandaQuant Logo"
            style={{ width: 30, height: 30 }}
          />
        </Box>
      </motion.div>
      <Typography
        variant="h6"
        sx={{
          fontWeight: 700,
          ...themeUtils.createTextGradient(
            theme.palette.primary.main,
            theme.palette.secondary.main
          ),
          textShadow: `0 0 10px ${alpha(theme.palette.primary.main, 0.3)}`,
          letterSpacing: '0.5px',
          position: 'relative',
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: -2,
            left: 0,
            width: '100%',
            height: '2px',
            background: themeUtils.createGradient(
              theme.palette.primary.main,
              theme.palette.secondary.main
            ),
            opacity: 0.5,
          },
        }}
      >
        PandaQuant
      </Typography>
    </Box>
  );

  const DesktopNav = () => (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center',
      gap: themeUtils.spacing.grid,
      '& > *': {
        minWidth: 'auto',
        px: 2,
      }
    }}>
      {navItems.map((item) => (
        <motion.div
          key={item.href}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: themeUtils.animationConfig.duration.slow }}
        >
          <Button
            href={item.href}
            sx={{
              color: theme.palette.primary.main,
              position: 'relative',
              fontSize: '1rem',
              fontWeight: 500,
              '&:hover': {
                opacity: 1,
                '&::after': {
                  width: '100%',
                  boxShadow: `0 0 10px ${alpha(theme.palette.primary.main, 0.5)}`,
                },
                '& .arrow-icon': {
                  transform: 'translateX(4px)',
                },
              },
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '0%',
                height: '2px',
                background: themeUtils.createGradient(
                  theme.palette.primary.main,
                  theme.palette.secondary.main
                ),
                transition: `all ${themeUtils.animationConfig.duration.slow}s ease`,
                boxShadow: 'none',
              },
            }}
          >
            {item.label}
            <ArrowForwardIcon 
              className="arrow-icon"
              sx={{ 
                fontSize: '1rem',
                ml: 0.5,
                transition: 'transform 0.3s ease',
              }}
            />
          </Button>
        </motion.div>
      ))}
    </Box>
  );

  const MobileNav = () => (
    <Drawer
      anchor="right"
      open={drawerOpen}
      onClose={toggleDrawer}
      PaperProps={{
        sx: {
          ...themeUtils.backgroundStyles.card(theme),
          width: 280,
          borderLeft: `1px solid ${theme.palette.divider}`,
          background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)} 0%, ${alpha(theme.palette.background.default, 0.9)} 100%)`,
          backdropFilter: 'blur(10px)',
          boxShadow: `0 0 30px ${alpha(theme.palette.primary.main, 0.1)}`,
        },
      }}
    >
        <List>
        {navItems.map((item) => (
              <ListItem 
            key={item.href}
                button 
            component="a"
            href={item.href}
            onClick={toggleDrawer}
                sx={{
              color: theme.palette.primary.main,
              position: 'relative',
                  py: 2,
                  '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                '&::after': {
                  width: '100%',
                  boxShadow: `0 0 10px ${alpha(theme.palette.primary.main, 0.5)}`,
                },
                '& .arrow-icon': {
                  transform: 'translateX(4px)',
                },
              },
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '0%',
                height: '2px',
                background: themeUtils.createGradient(
                  theme.palette.primary.main,
                  theme.palette.secondary.main
                ),
                transition: `all ${themeUtils.animationConfig.duration.slow}s ease`,
                boxShadow: 'none',
                  },
                }}
              >
                <ListItemText
              primary={item.label}
              sx={{
                '& .MuiTypography-root': {
                      fontWeight: 500,
                    },
                  }}
                />
            <ArrowForwardIcon 
              className="arrow-icon"
              sx={{ 
                fontSize: '1rem',
                transition: 'transform 0.3s ease',
              }}
            />
              </ListItem>
          ))}
        </List>
    </Drawer>
  );

  return (
    <AppBar 
      position="sticky"
      sx={{ 
        ...themeUtils.backgroundStyles.section(theme),
        backdropFilter: 'blur(10px)',
        boxShadow: `0 4px 30px ${alpha(theme.palette.action.hover, 0.1)}`,
        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)} 0%, ${alpha(theme.palette.background.default, 0.9)} 100%)`,
        '& .MuiTypography-root, & .MuiButton-root, & .MuiIconButton-root': {
          color: theme.palette.primary.main,
          '&:hover': {
            color: theme.palette.secondary.main,
          },
        },
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <Logo />
          <Box sx={{ flexGrow: 1 }} />
          {!isMobile && <DesktopNav />}
          <Stack direction="row" spacing={1} sx={{ ml: 2 }}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
              <IconButton
                onClick={handleLanguageClick}
                sx={{
                  background: alpha(theme.palette.primary.main, 0.1),
                  '&:hover': {
                    background: alpha(theme.palette.primary.main, 0.2),
                  },
                }}
              >
                <LanguageIcon />
              </IconButton>
            </motion.div>
            {isMobile && (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <IconButton
                  onClick={toggleDrawer}
                  sx={{
                    background: alpha(theme.palette.primary.main, 0.1),
                    '&:hover': {
                      background: alpha(theme.palette.primary.main, 0.2),
                    },
                  }}
                >
                  <MenuIcon />
                </IconButton>
              </motion.div>
            )}
          </Stack>
        </Toolbar>
      </Container>
          <Menu
        anchorEl={languageAnchor}
        open={Boolean(languageAnchor)}
        onClose={handleLanguageClose}
            PaperProps={{
              sx: {
            ...themeUtils.backgroundStyles.card(theme),
            ...themeUtils.cardStyle,
            mt: 1,
            background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)} 0%, ${alpha(theme.palette.background.default, 0.9)} 100%)`,
            backdropFilter: 'blur(10px)',
            boxShadow: `0 0 30px ${alpha(theme.palette.primary.main, 0.1)}`,
          },
        }}
      >
        {languages.map((lang) => (
          <MenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            selected={i18n.language === lang.code}
            sx={{
              '&:hover': {
                background: alpha(theme.palette.primary.main, 0.1),
              },
              '&.Mui-selected': {
                background: alpha(theme.palette.primary.main, 0.2),
                '&:hover': {
                  background: alpha(theme.palette.primary.main, 0.3),
                },
              },
            }}
          >
            {lang.name}
            </MenuItem>
        ))}
          </Menu>
      <MobileNav />
    </AppBar>
  );
};

export default Header; 