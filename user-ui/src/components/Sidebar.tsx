import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider,
  Box,
  Typography,
  Button
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  AccountBalance as AssetIcon,
  Person as ProfileIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  AddCircle as DepositIcon,
  AccountBalanceWallet as WithdrawIcon,
  TrendingUp as ProfitIcon,
  Science as BacktestIcon
} from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';

const drawerWidth = 240;

interface MenuItem {
  text: string;
  icon: React.ReactNode;
  path: string;
}

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const menuItems: MenuItem[] = [
    { text: '仪表盘', icon: <DashboardIcon />, path: '/dashboard' },
    { text: '资产中心', icon: <AssetIcon />, path: '/asset-center' },
    { text: '个人中心', icon: <ProfileIcon />, path: '/profile' },
    { text: '消息中心', icon: <NotificationsIcon />, path: '/notifications' },
    { text: '设置', icon: <SettingsIcon />, path: '/settings' },
    { text: '利润中心', icon: <ProfitIcon />, path: '/profit' },
    { text: '回测', icon: <BacktestIcon />, path: '/backtest/config' }
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          bgcolor: '#f5f5f5',
          mt: '64px'
        }
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ color: '#4CAF50' }}>
          熊猫量化
        </Typography>
      </Box>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => handleNavigation(item.path)}
              sx={{
                '&.Mui-selected': {
                  bgcolor: 'rgba(76, 175, 80, 0.08)',
                  '&:hover': {
                    bgcolor: 'rgba(76, 175, 80, 0.12)'
                  }
                }
              }}
            >
              <ListItemIcon sx={{ color: location.pathname === item.path ? '#4CAF50' : 'inherit' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text}
                sx={{ color: location.pathname === item.path ? '#4CAF50' : 'inherit' }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      {isAuthenticated && (
        <Box sx={{ p: 2 }}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={() => handleNavigation('/deposit/create')}
          >
            Deposit
          </Button>
        </Box>
      )}
    </Drawer>
  );
};

export default Sidebar; 