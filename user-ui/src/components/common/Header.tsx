import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Box,
  Menu,
  MenuItem,
  Avatar,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';
import {
  Menu as MenuIcon,
  AccountCircle,
  Notifications,
  Settings,
  Logout
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';
import { User } from '../../types/user';

const Header: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    handleClose();
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box>
      <List>
        <ListItem button component={RouterLink} to="/dashboard">
          <ListItemText primary={t('header.dashboard')} />
        </ListItem>
        <ListItem button component={RouterLink} to="/profile">
          <ListItemText primary={t('header.profile')} />
        </ListItem>
        <ListItem button component={RouterLink} to="/settings">
          <ListItemText primary={t('header.settings')} />
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem button onClick={handleLogout}>
          <ListItemText primary={t('header.logout')} />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={handleDrawerToggle}
          sx={{ mr: 2, display: { md: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
        
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{
            flexGrow: 1,
            textDecoration: 'none',
            color: 'inherit'
          }}
        >
          {t('app.name')}
        </Typography>

        {user ? (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton color="inherit">
              <Notifications />
            </IconButton>
            <IconButton
              onClick={handleMenu}
              color="inherit"
              sx={{ ml: 2 }}
            >
              {user.avatar ? (
                <Avatar
                  alt={user.username}
                  src={user.avatar}
                  sx={{ width: 32, height: 32 }}
                />
              ) : (
                <AccountCircle />
              )}
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem component={RouterLink} to="/profile" onClick={handleClose}>
                <AccountCircle sx={{ mr: 1 }} /> {t('header.profile')}
              </MenuItem>
              <MenuItem component={RouterLink} to="/settings" onClick={handleClose}>
                <Settings sx={{ mr: 1 }} /> {t('header.settings')}
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <Logout sx={{ mr: 1 }} /> {t('header.logout')}
              </MenuItem>
            </Menu>
          </Box>
        ) : (
          <Box>
            <Button
              color="inherit"
              component={RouterLink}
              to="/login"
              sx={{ mr: 1 }}
            >
              {t('header.login')}
            </Button>
            <Button
              variant="contained"
              color="primary"
              component={RouterLink}
              to="/register"
            >
              {t('header.register')}
            </Button>
          </Box>
        )}
      </Toolbar>

      <Drawer
        variant="temporary"
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 }
        }}
      >
        {drawer}
      </Drawer>
    </AppBar>
  );
};

export default Header; 