import React, { useState, useEffect } from 'react';
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
  Typography,
  Container,
  Menu,
  MenuItem,
  Avatar,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  Menu as MenuIcon,
  Language as LanguageIcon,
  AccountCircle as AccountIcon,
  Dashboard as DashboardIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { alpha } from '@mui/material/styles';
import { themeUtils } from '../../theme';

const Navbar: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [languageAnchor, setLanguageAnchor] = useState<null | HTMLElement>(null);
  const [userAnchor, setUserAnchor] = useState<null | HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const { t, i18n } = useTranslation();
  const { isAuthenticated, logout } = useAuth();

  const navItems = [
    { label: '产品介绍', path: '/product' },
    { label: '收益榜', path: '/profit' },
    { label: '量化策略', path: '/product/strategies' },
    { label: '安全保障', path: '/security' },
    { label: '邀请返佣', path: '/invite' },
  ];

  const languages = [
    { code: 'en', name: t('language.english') },
    { code: 'zh', name: t('language.chinese') },
    { code: 'ko', name: t('language.korean') },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  const handleUserClick = (event: React.MouseEvent<HTMLElement>) => {
    setUserAnchor(event.currentTarget);
  };

  const handleUserClose = () => {
    setUserAnchor(null);
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setDrawerOpen(false);
    handleUserClose();
  };

  const handleLogout = async () => {
    try {
      await logout();
      handleUserClose();
      setDrawerOpen(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const Logo = () => (
    <Box 
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 1.5,
        cursor: 'pointer',
        '&:hover': {
          '& .panda-logo': {
            transform: 'scale(1.1)',
          }
        }
      }}
      onClick={() => handleNavigation('/')}
    >
      <Box
        className="panda-logo"
        sx={{
          fontSize: '1.8rem',
          transition: 'transform 0.3s ease',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          background: alpha(theme.palette.primary.main, 0.1),
        }}
      >
        🐼
      </Box>
      <Typography
        variant="h6"
        sx={{
          background: themeUtils.createGradient(theme.palette.primary.main, theme.palette.primary.dark),
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 700,
          fontSize: '1.3rem',
          letterSpacing: '0.5px',
        }}
      >
        Panda Quant
      </Typography>
    </Box>
  );

  const UserMenu = () => (
    <Menu
      anchorEl={userAnchor}
      open={Boolean(userAnchor)}
      onClose={handleUserClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
    >
      <MenuItem onClick={() => handleNavigation('/dashboard')}>
        <DashboardIcon sx={{ mr: 1 }} />
        {t('nav.dashboard')}
      </MenuItem>
      <MenuItem onClick={handleLogout}>
        <AccountIcon sx={{ mr: 1 }} />
        {t('nav.logout')}
      </MenuItem>
    </Menu>
  );

  const DesktopNav = () => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, justifyContent: 'center', flex: 1 }}>
      {navItems.map((item) => (
        <Button
          key={item.path}
          onClick={() => handleNavigation(item.path)}
          sx={{
            color: location.pathname === item.path ? theme.palette.primary.main : theme.palette.text.secondary,
            fontWeight: 600,
            fontSize: '1rem',
            textTransform: 'none',
            position: 'relative',
            textAlign: 'center',
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: -2,
              left: 0,
              width: '100%',
              height: '2px',
              background: themeUtils.createGradient(theme.palette.primary.main, 'transparent'),
              transform: location.pathname === item.path ? 'scaleX(1)' : 'scaleX(0)',
              transition: 'transform 0.3s ease',
            },
            '&:hover::after': {
              transform: 'scaleX(1)',
            },
          }}
        >
          {item.label}
        </Button>
      ))}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, ml: 2 }}>
        <IconButton color="inherit" onClick={handleLanguageClick}>
          <LanguageIcon />
        </IconButton>
        {isAuthenticated ? (
          <IconButton color="inherit" onClick={handleUserClick}>
            <Avatar sx={{ width: 32, height: 32 }}>
              <AccountIcon />
            </Avatar>
          </IconButton>
        ) : (
          <>
            <Button
              variant="outlined"
              size="small"
              onClick={() => handleNavigation('/login')}
              sx={{
                color: theme.palette.primary.main,
                borderColor: theme.palette.primary.main,
                borderRadius: '20px',
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.9rem',
                px: 2,
                '&:hover': {
                  borderColor: theme.palette.primary.dark,
                  backgroundColor: alpha(theme.palette.primary.main, 0.05),
                },
              }}
            >
              登录
            </Button>
            <Button
              variant="contained"
              size="small"
              onClick={() => handleNavigation('/register')}
              sx={{
                background: themeUtils.createGradient(theme.palette.primary.main, theme.palette.primary.dark),
                borderRadius: '20px',
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.9rem',
                px: 2,
                '&:hover': {
                  background: themeUtils.createGradient(theme.palette.primary.dark, theme.palette.primary.main),
                },
              }}
            >
              注册
            </Button>
          </>
        )}
      </Box>
    </Box>
  );

  const MobileNav = () => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <IconButton color="inherit" onClick={handleLanguageClick}>
        <LanguageIcon />
      </IconButton>
      {isAuthenticated ? (
        <IconButton color="inherit" onClick={handleUserClick}>
          <Avatar sx={{ width: 32, height: 32 }}>
            <AccountIcon />
          </Avatar>
        </IconButton>
      ) : (
        <>
          <Button
            variant="outlined"
            size="small"
            onClick={() => handleNavigation('/login')}
            sx={{
              color: theme.palette.primary.main,
              borderColor: theme.palette.primary.main,
              borderRadius: '20px',
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.9rem',
              px: 2,
              '&:hover': {
                borderColor: theme.palette.primary.dark,
                backgroundColor: alpha(theme.palette.primary.main, 0.05),
              },
            }}
          >
            登录
          </Button>
          <Button
            variant="contained"
            size="small"
            onClick={() => handleNavigation('/register')}
            sx={{
              background: themeUtils.createGradient(theme.palette.primary.main, theme.palette.primary.dark),
              borderRadius: '20px',
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.9rem',
              px: 2,
              '&:hover': {
                background: themeUtils.createGradient(theme.palette.primary.dark, theme.palette.primary.main),
              },
            }}
          >
            注册
          </Button>
        </>
      )}
      <IconButton color="inherit" onClick={toggleDrawer}>
        <MenuIcon />
      </IconButton>
    </Box>
  );

  return (
    <AppBar
      position="fixed"
      sx={{
        bgcolor: scrolled ? 'rgba(255, 255, 255, 0.95)' : 'transparent',
        backdropFilter: 'blur(10px)',
        boxShadow: scrolled ? '0 2px 10px rgba(0, 0, 0, 0.1)' : 'none',
        transition: 'all 0.3s ease',
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
          <Logo />
          {isMobile ? <MobileNav /> : <DesktopNav />}
        </Toolbar>
      </Container>
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={toggleDrawer}
        sx={{
          '& .MuiDrawer-paper': {
            width: '100%',
            maxWidth: '400px',
            bgcolor: 'background.paper',
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <List>
            {navItems.map((item) => (
              <ListItem
                key={item.path}
                button
                onClick={() => handleNavigation(item.path)}
                sx={{
                  py: 1,
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                  },
                }}
              >
                <ListItemText
                  primary={item.label}
                  sx={{
                    color: location.pathname === item.path ? theme.palette.primary.main : theme.palette.text.primary,
                    fontWeight: location.pathname === item.path ? 600 : 400,
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      <Menu
        anchorEl={languageAnchor}
        open={Boolean(languageAnchor)}
        onClose={handleLanguageClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {languages.map((lang) => (
          <MenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            selected={i18n.language === lang.code}
          >
            {lang.name}
          </MenuItem>
        ))}
      </Menu>
      <UserMenu />
    </AppBar>
  );
};

export default Navbar; 