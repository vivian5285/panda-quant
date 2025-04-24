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
  Badge,
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  Menu as MenuIcon,
  Language as LanguageIcon,
  AccountCircle as AccountIcon,
  Dashboard as DashboardIcon,
  People as UsersIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  Logout as LogoutIcon,
  Analytics as AnalyticsIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const AdminNavbar: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [languageAnchor, setLanguageAnchor] = useState<null | HTMLElement>(null);
  const [userAnchor, setUserAnchor] = useState<null | HTMLElement>(null);
  const [notificationAnchor, setNotificationAnchor] = useState<null | HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const { t, i18n } = useTranslation();
  const { isAuthenticated, logout } = useAuth();

  const navItems = [
    { label: t('nav.dashboard'), path: '/admin/dashboard', icon: <DashboardIcon /> },
    { label: t('nav.users'), path: '/admin/users', icon: <UsersIcon /> },
    { label: t('nav.analytics'), path: '/admin/analytics', icon: <AnalyticsIcon /> },
    { label: t('nav.security'), path: '/admin/security', icon: <SecurityIcon /> },
    { label: t('nav.settings'), path: '/admin/settings', icon: <SettingsIcon /> },
  ];

  const languages = [
    { code: 'en', name: t('language.english') },
    { code: 'zh', name: t('language.chinese') },
    { code: 'ko', name: t('language.korean') },
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

  const handleNotificationClick = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchor(null);
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setDrawerOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const Logo = () => (
    <Box
      component={motion.div}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      sx={{ cursor: 'pointer' }}
      onClick={() => navigate('/admin/dashboard')}
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
        PANDA QUANT ADMIN
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
      <MenuItem onClick={() => handleNavigation('/admin/profile')}>
        <AccountIcon sx={{ mr: 1 }} />
        {t('nav.profile')}
      </MenuItem>
      <MenuItem onClick={handleLogout}>
        <LogoutIcon sx={{ mr: 1 }} />
        {t('nav.logout')}
      </MenuItem>
    </Menu>
  );

  const NotificationMenu = () => (
    <Menu
      anchorEl={notificationAnchor}
      open={Boolean(notificationAnchor)}
      onClose={handleNotificationClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
    >
      <MenuItem>
        <ListItemText
          primary="New user registered"
          secondary="2 hours ago"
        />
      </MenuItem>
      <MenuItem>
        <ListItemText
          primary="System update available"
          secondary="5 hours ago"
        />
      </MenuItem>
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
      <IconButton color="inherit" onClick={handleNotificationClick}>
        <Badge badgeContent={2} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
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
          <ListItem button onClick={handleNotificationClick}>
            <Badge badgeContent={2} color="error" sx={{ mr: 1 }}>
              <NotificationsIcon />
            </Badge>
            <ListItemText primary={t('nav.notifications')} />
          </ListItem>
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
      <NotificationMenu />
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

export default AdminNavbar; 