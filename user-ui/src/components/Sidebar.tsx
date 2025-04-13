import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AssessmentIcon from '@mui/icons-material/Assessment';

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const menuItems = [
    { text: t('common.dashboard'), icon: <DashboardIcon />, path: '/dashboard' },
    { text: t('common.profile'), icon: <PersonIcon />, path: '/profile' },
    { text: t('common.settings'), icon: <SettingsIcon />, path: '/settings' },
    { text: t('common.notifications'), icon: <NotificationsIcon />, path: '/notifications' },
    { text: 'Asset Center', icon: <AccountBalanceIcon />, path: '/asset-center' },
    { text: 'My Profit', icon: <TrendingUpIcon />, path: '/profit' },
    { text: 'Backtest', icon: <AssessmentIcon />, path: '/backtest/config' },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
          mt: '64px',
        },
      }}
    >
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => navigate(item.path)}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar; 