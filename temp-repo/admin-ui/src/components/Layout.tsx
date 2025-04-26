import { useState } from 'react';
import { Box, AppBar, Toolbar, IconButton, Typography, Button } from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Settings as SettingsIcon,
  List as ListIcon,
  Code as CodeIcon,
  Description as DescriptionIcon,
  AccountBalance as AccountBalanceIcon,
  AttachMoney as AttachMoneyIcon,
  TrendingUp as TrendingUpIcon,
  Payment as PaymentIcon,
  School as SchoolIcon,
  Science as ScienceIcon,
  Monitor as MonitorIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { Outlet } from 'react-router-dom';
import MobileMenu from './MobileMenu';
import { useAuth } from '../hooks/useAuth';
import { theme } from '../theme';

const Layout = () => {
  const { t } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { logout } = useAuth();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    { text: t('navigation.dashboard'), path: '/', icon: <DashboardIcon /> },
    { text: t('navigation.users'), path: '/users', icon: <PeopleIcon /> },
    { text: t('navigation.chains'), path: '/chains', icon: <AccountBalanceIcon /> },
    { text: t('navigation.strategies'), path: '/strategies', icon: <CodeIcon /> },
    { text: t('navigation.withdrawals'), path: '/withdrawals', icon: <PaymentIcon /> },
    { text: t('navigation.userStatus'), path: '/user-status', icon: <SettingsIcon /> },
    { text: t('navigation.commissions'), path: '/commissions', icon: <AttachMoneyIcon /> },
    { text: t('navigation.profits'), path: '/profits', icon: <TrendingUpIcon /> },
    { text: t('navigation.commissionSettlement'), path: '/commission-settlement', icon: <ListIcon /> },
    { text: t('navigation.education'), path: '/education', icon: <SchoolIcon /> },
    { text: t('navigation.abTesting'), path: '/ab-testing', icon: <ScienceIcon /> },
    { text: t('navigation.monitoring'), path: '/monitoring', icon: <MonitorIcon /> },
    { text: t('navigation.settings'), path: '/settings', icon: <SettingsIcon /> },
    { text: t('navigation.logs'), path: '/logs', icon: <DescriptionIcon /> },
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar 
        position="fixed"
        sx={{
          background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          backdropFilter: 'blur(10px)',
          boxShadow: 'none',
          borderBottom: `1px solid ${theme.palette.primary.main}20`,
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar sx={{ px: { xs: 1.5, sm: 2, md: 3 } }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ 
              mr: 2, 
              display: { sm: 'none' },
              color: theme.palette.primary.main,
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography 
            variant="h6" 
            noWrap 
            sx={{ 
              flexGrow: 1,
              color: theme.palette.primary.main,
              fontWeight: 700,
              fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' },
            }}
          >
            {t('appName')}
          </Typography>
          <Button 
            color="inherit" 
            onClick={logout}
            sx={{
              color: theme.palette.primary.main,
              fontSize: { xs: '0.875rem', sm: '1rem' },
              '&:hover': {
                backgroundColor: `${theme.palette.primary.main}10`,
              },
            }}
          >
            {t('logout')}
          </Button>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{
          width: { sm: 240 },
          flexShrink: { sm: 0 },
        }}
      >
        <MobileMenu
          mobileOpen={mobileOpen}
          onClose={handleDrawerToggle}
          menuItems={menuItems}
        />
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          width: { sm: `calc(100% - 240px)` },
          mt: { xs: 7, sm: 8 },
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout; 