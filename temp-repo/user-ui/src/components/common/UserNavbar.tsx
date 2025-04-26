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
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  Menu as MenuIcon,
  Language as LanguageIcon,
  AccountCircle as AccountIcon,
  Dashboard as DashboardIcon,
  Settings as SettingsIcon,
  Payment as PaymentIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const UserNavbar: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [languageAnchor, setLanguageAnchor] = useState<null | HTMLElement>(null);
  const [userAnchor, setUserAnchor] = useState<null | HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const { t, i18n } = useTranslation();
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { label: t('nav.dashboard'), path: '/dashboard', icon: <DashboardIcon /> },
    { label: t('nav.strategies'), path: '/strategies', icon: <SettingsIcon /> },
    { label: t('nav.api'), path: '/api-management', icon: <SettingsIcon /> },
    { label: t('nav.messages'), path: '/messages', icon: <SettingsIcon /> },
    { label: t('nav.invite'), path: '/invite', icon: <SettingsIcon /> },
  ];

  const languages = [
    { code: 'en', name: t('language.english') },
    { code: 'zh', name: t('language.chinese') },
    { code: 'ko', name: t('language.korean') },
  ];

  const userMenuItems = [
    { label: t('nav.profile'), path: '/account-settings/profile', icon: <AccountIcon /> },
    { label: t('nav.settings'), path: '/account-settings', icon: <SettingsIcon /> },
    { label: t('nav.deposit'), path: '/deposit', icon: <PaymentIcon /> },
    { label: t('nav.withdraw'), path: '/withdraw', icon: <PaymentIcon /> },
    { label: t('nav.referral'), path: '/referral/rewards', icon: <SettingsIcon /> },
    { label: t('nav.logout'), path: '/logout', icon: <LogoutIcon />, action: handleLogout },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
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
  };

  const Logo = () => (
    <Box
      component={motion.div}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      sx={{ cursor: 'pointer' }}
      onClick={() => navigate('/')}
    >
      <Typography
        variant="h6"
        sx={{
          fontWeight: 'bold',
          background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        PANDA QUANT
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
      {userMenuItems.map((item) => (
        <MenuItem
          key={item.path}
          onClick={() => {
            if (item.action) {
              item.action();
            } else {
              handleNavigation(item.path);
            }
            handleUserClose();
          }}
        >
          {item.icon}
          <ListItemText primary={item.label} sx={{ ml: 1 }} />
        </MenuItem>
      ))}
    </Menu>
  );

  const DesktopNav = () => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      {navItems.map((item) => (
        <Button
          key={item.path}
          color="inherit"
          onClick={() => handleNavigation(item.path)}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          {item.icon}
          {item.label}
        </Button>
      ))}
      <IconButton color="inherit" onClick={handleLanguageClick}>
        <LanguageIcon />
      </IconButton>
      <IconButton color="inherit" onClick={handleUserClick}>
        <Avatar sx={{ width: 32, height: 32 }} />
      </IconButton>
    </Box>
  );

  const MobileNav = () => (
    <>
      <IconButton color="inherit" onClick={toggleDrawer}>
        <MenuIcon />
      </IconButton>
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={toggleDrawer}
        PaperProps={{
          sx: {
            width: '100%',
            maxWidth: 360,
            bgcolor: theme.palette.background.default,
          },
        }}
      >
        <List>
          {navItems.map((item) => (
            <ListItem
              key={item.path}
              button
              onClick={() => handleNavigation(item.path)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              {item.icon}
              <ListItemText primary={item.label} />
            </ListItem>
          ))}
          <ListItem button onClick={handleLanguageClick}>
            <LanguageIcon sx={{ mr: 1 }} />
            <ListItemText primary={t('nav.language')} />
          </ListItem>
          <ListItem button onClick={handleUserClick}>
            <AccountIcon sx={{ mr: 1 }} />
            <ListItemText primary={t('nav.profile')} />
          </ListItem>
          <ListItem button onClick={handleLogout}>
            <LogoutIcon sx={{ mr: 1 }} />
            <ListItemText primary={t('nav.logout')} />
          </ListItem>
        </List>
      </Drawer>
    </>
  );

  return (
    <AppBar
      position="fixed"
      elevation={scrolled ? 4 : 0}
      sx={{
        bgcolor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        transition: 'all 0.3s ease',
      }}
    >
      <Container maxWidth="lg">
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Logo />
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            <DesktopNav />
          </Box>
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <MobileNav />
          </Box>
        </Toolbar>
      </Container>
      <UserMenu />
      <Menu
        anchorEl={languageAnchor}
        open={Boolean(languageAnchor)}
        onClose={handleLanguageClose}
      >
        {languages.map((lang) => (
          <MenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
          >
            {lang.name}
          </MenuItem>
        ))}
      </Menu>
    </AppBar>
  );
};

export default UserNavbar; 