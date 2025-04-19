import React from 'react';
import { Box, AppBar, Toolbar, IconButton, Typography, Button } from '@mui/material';
import { Menu as MenuIcon, Dashboard as DashboardIcon, People as PeopleIcon, Settings as SettingsIcon, List as ListIcon, Code as CodeIcon, Description as DescriptionIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { Outlet } from 'react-router-dom';
import MobileMenu from './MobileMenu';
import { useAuth } from '../hooks/useAuth';

const Layout: React.FC = () => {
  const { t } = useTranslation();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const { logout } = useAuth();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    { text: t('navigation.dashboard'), path: '/', icon: <DashboardIcon /> },
    { text: t('navigation.users'), path: '/users', icon: <PeopleIcon /> },
    { text: t('navigation.chains'), path: '/chains', icon: <ListIcon /> },
    { text: t('navigation.strategies'), path: '/strategies', icon: <CodeIcon /> },
    { text: t('navigation.logs'), path: '/logs', icon: <DescriptionIcon /> },
    { text: t('navigation.settings'), path: '/settings', icon: <SettingsIcon /> },
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {t('appName')}
          </Typography>
          <Button color="inherit" onClick={logout}>
            {t('logout')}
          </Button>
        </Toolbar>
      </AppBar>
      <MobileMenu
        mobileOpen={mobileOpen}
        onClose={handleDrawerToggle}
        menuItems={menuItems}
      />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout; 