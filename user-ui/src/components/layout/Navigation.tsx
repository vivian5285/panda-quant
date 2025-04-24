import { ListItem, ListItemIcon, ListItemText, List, Box, Avatar, Typography, Divider, Tooltip } from '@mui/material';
import { 
  Dashboard, 
  AccountBalanceWallet, 
  Settings, 
  ExitToApp, 
  People, 
  Assessment,
  Notifications,
  Help
} from '@mui/icons-material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';

interface MenuItem {
  text: string;
  icon: React.ReactNode;
  path: string;
  tooltip?: string;
}

const Navigation: React.FC = () => {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems: MenuItem[] = [
    { text: '首页', icon: <Dashboard />, path: '/home', tooltip: '查看平台概览' },
    { text: '我的佣金', icon: <AccountBalanceWallet />, path: '/commission', tooltip: '查看佣金收益' },
    { text: '团队管理', icon: <People />, path: '/team', tooltip: '管理团队成员' },
    { text: '数据分析', icon: <Assessment />, path: '/analytics', tooltip: '查看数据分析' },
    { text: '通知中心', icon: <Notifications />, path: '/notifications', tooltip: '查看系统通知' },
    { text: '帮助中心', icon: <Help />, path: '/help', tooltip: '获取帮助信息' },
    { text: '设置', icon: <Settings />, path: '/settings', tooltip: '系统设置' },
  ];

  const handleLogout = () => {
    // TODO: Implement logout logic
    navigate('/login');
  };

  return (
    <Box 
      component={motion.div}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      sx={{ 
        width: '100%',
        maxWidth: 280,
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: theme.shadows[2],
        p: 2,
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* User Profile Section */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        mb: 3,
        p: 2,
        borderRadius: 2,
        bgcolor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText
      }}>
        <Avatar 
          sx={{ 
            width: 48, 
            height: 48,
            mr: 2,
            border: `2px solid ${theme.palette.primary.contrastText}`
          }}
        />
        <Box>
          <Typography variant="subtitle1" fontWeight="bold">
            用户名
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            普通用户
          </Typography>
        </Box>
      </Box>

      {/* Navigation Menu */}
      <List component="nav" sx={{ flex: 1 }}>
        {menuItems.map((item) => (
          <Tooltip key={item.path} title={item.tooltip} placement="right">
            <ListItem
              button
              component={Link}
              to={item.path}
              sx={{
                mb: 1,
                borderRadius: 2,
                backgroundColor: location.pathname === item.path 
                  ? theme.palette.primary.main 
                  : 'transparent',
                color: location.pathname === item.path 
                  ? theme.palette.primary.contrastText 
                  : theme.palette.text.primary,
                '&:hover': {
                  backgroundColor: location.pathname === item.path 
                    ? theme.palette.primary.dark 
                    : theme.palette.action.hover,
                },
                transition: 'all 0.3s ease-in-out'
              }}
            >
              <ListItemIcon sx={{ 
                color: location.pathname === item.path 
                  ? theme.palette.primary.contrastText 
                  : theme.palette.text.secondary,
                minWidth: 40
              }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text}
                sx={{
                  '& .MuiTypography-root': {
                    fontWeight: location.pathname === item.path ? 'bold' : 'normal'
                  }
                }}
              />
            </ListItem>
          </Tooltip>
        ))}
      </List>

      <Divider sx={{ my: 2 }} />

      {/* Logout Button */}
      <Tooltip title="退出登录" placement="right">
        <ListItem
          button
          onClick={handleLogout}
          sx={{
            borderRadius: 2,
            color: theme.palette.error.main,
            '&:hover': {
              backgroundColor: theme.palette.error.light,
              color: theme.palette.error.contrastText
            },
            transition: 'all 0.3s ease-in-out'
          }}
        >
          <ListItemIcon sx={{ 
            color: 'inherit',
            minWidth: 40
          }}>
            <ExitToApp />
          </ListItemIcon>
          <ListItemText primary="退出" />
        </ListItem>
      </Tooltip>
    </Box>
  );
};

export default Navigation; 