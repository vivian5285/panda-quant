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
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Navbar: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [languageAnchor, setLanguageAnchor] = useState<null | HTMLElement>(null);
  const [userAnchor, setUserAnchor] = useState<null | HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const { t, i18n } = useTranslation();
  const { isAuthenticated, logout } = useAuth();

  const navItems = [
    { label: t('nav.home'), path: '/' },
    { label: t('nav.strategies'), path: '/strategies' },
    { label: t('nav.performance'), path: '/profit' },
    { label: t('nav.referral'), path: '/invite' },
    { label: t('nav.about'), path: '/about' },
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
        gap: 1,
        cursor: 'pointer',
      }}
      onClick={() => handleNavigation('/')}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <Box
          sx={{
            fontSize: '1.8rem',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'rgba(0, 255, 184, 0.1)',
            marginRight: '8px',
          }}
        >
          🐼
        </Box>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            fontSize: '1.5rem',
            letterSpacing: '0.5px',
            background: 'linear-gradient(45deg, #00FFB8 30%, #00CC93 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            position: 'relative',
            display: 'inline-block',
            '&:after': {
              content: '""',
              position: 'absolute',
              bottom: -2,
              left: 0,
              width: '100%',
              height: '2px',
              background: 'linear-gradient(90deg, #00FFB8, transparent)',
            },
          }}
        >
          Panda Quant
        </Typography>
      </Box>
    </Box>
  );

  const UserMenu = () => (
    <Menu
      anchorEl={userAnchor}
      open={Boolean(userAnchor)}
      onClose={handleUserClose}
      PaperProps={{
        sx: {
          mt: 1.5,
          minWidth: 200,
          borderRadius: 2,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        },
      }}
    >
      <MenuItem onClick={() => handleNavigation('/dashboard')}>
        <DashboardIcon sx={{ mr: 2 }} />
        控制面板
      </MenuItem>
      <MenuItem onClick={() => handleNavigation('/profile')}>
        <AccountIcon sx={{ mr: 2 }} />
        个人资料
      </MenuItem>
      <MenuItem onClick={handleLogout}>
        <Typography color="error">退出登录</Typography>
      </MenuItem>
    </Menu>
  );

  const DesktopNav = () => (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center',
      gap: 3,
      '& > *': {
        minWidth: 'auto',
        px: 2,
      }
    }}>
      {navItems.map((item) => (
        <motion.div
          key={item.path}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            onClick={() => handleNavigation(item.path)}
            sx={{
              color: '#666666',
              position: 'relative',
              fontSize: '1rem',
              fontWeight: 500,
              letterSpacing: '0.5px',
              textTransform: 'none',
              whiteSpace: 'nowrap',
              '&:hover': {
                color: '#00FFB8',
                '&::after': {
                  width: '100%',
                },
              },
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '0%',
                height: '2px',
                background: 'linear-gradient(90deg, #00FFB8, transparent)',
                transition: 'width 0.3s ease',
              },
            }}
          >
            {item.label}
          </Button>
        </motion.div>
      ))}
      <Box sx={{ display: 'flex', gap: 2, ml: 2 }}>
        {isAuthenticated ? (
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <IconButton
              onClick={handleUserClick}
              sx={{
                color: '#666666',
                '&:hover': {
                  bgcolor: 'rgba(0, 255, 184, 0.1)',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: 'rgba(0, 255, 184, 0.1)',
                  color: '#00FFB8',
                }}
              >
                <AccountIcon />
              </Avatar>
            </IconButton>
          </motion.div>
        ) : (
          <>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                variant="outlined"
                onClick={() => handleNavigation('/login')}
                sx={{
                  borderColor: '#00FFB8',
                  color: '#00FFB8',
                  py: 1,
                  px: 3,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 500,
                  letterSpacing: '0.5px',
                  whiteSpace: 'nowrap',
                  '&:hover': {
                    borderColor: '#00CC93',
                    bgcolor: 'rgba(0, 255, 184, 0.1)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 10px 20px rgba(0, 255, 184, 0.1)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                登录
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                variant="contained"
                onClick={() => handleNavigation('/register')}
                sx={{
                  bgcolor: '#00FFB8',
                  color: '#000000',
                  py: 1,
                  px: 3,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 500,
                  letterSpacing: '0.5px',
                  whiteSpace: 'nowrap',
                  '&:hover': {
                    bgcolor: '#00CC93',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 10px 20px rgba(0, 255, 184, 0.2)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                注册
              </Button>
            </motion.div>
          </>
        )}
      </Box>
    </Box>
  );

  const MobileNav = () => (
    <Drawer
      anchor="right"
      open={drawerOpen}
      onClose={toggleDrawer}
      PaperProps={{
        sx: {
          width: 240,
          borderLeft: '1px solid rgba(0, 0, 0, 0.2)',
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
              color: '#000000',
              position: 'relative',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.1)',
                '&::after': {
                  width: '100%',
                },
              },
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '0%',
                height: '2px',
                background: 'linear-gradient(90deg, #000000, #000000)',
                transition: 'width 0.3s ease',
              },
            }}
          >
            <ListItemText 
              primary={item.label}
              sx={{
                '& .MuiTypography-root': {
                  whiteSpace: 'nowrap',
                },
              }}
            />
          </ListItem>
        ))}
        <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
          {isAuthenticated ? (
            <>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => handleNavigation('/dashboard')}
                sx={{
                  borderColor: '#00FFB8',
                  color: '#00FFB8',
                  whiteSpace: 'nowrap',
                  '&:hover': {
                    borderColor: '#00CC93',
                    bgcolor: 'rgba(0, 255, 184, 0.1)',
                  },
                }}
              >
                控制面板
              </Button>
              <Button
                variant="contained"
                fullWidth
                onClick={handleLogout}
                sx={{
                  bgcolor: '#00FFB8',
                  color: '#000000',
                  whiteSpace: 'nowrap',
                  '&:hover': {
                    bgcolor: '#00CC93',
                  },
                }}
              >
                退出登录
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => handleNavigation('/login')}
                sx={{
                  borderColor: '#00FFB8',
                  color: '#00FFB8',
                  whiteSpace: 'nowrap',
                  '&:hover': {
                    borderColor: '#00CC93',
                    bgcolor: 'rgba(0, 255, 184, 0.1)',
                  },
                }}
              >
                登录
              </Button>
              <Button
                variant="contained"
                fullWidth
                onClick={() => handleNavigation('/register')}
                sx={{
                  bgcolor: '#00FFB8',
                  color: '#000000',
                  whiteSpace: 'nowrap',
                  '&:hover': {
                    bgcolor: '#00CC93',
                  },
                }}
              >
                注册
              </Button>
            </>
          )}
        </Box>
      </List>
    </Drawer>
  );

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: '#FFFFFF',
        boxShadow: 'none',
        borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
        '& .MuiContainer-root': {
          maxWidth: '100% !important',
          padding: '0 !important',
          margin: '0 !important',
        },
      }}
    >
      <Container maxWidth={false} disableGutters>
        <Toolbar sx={{ 
          justifyContent: 'space-between',
          px: { xs: 2, md: 4 },
          maxWidth: '1200px',
          margin: '0 auto',
          width: '100%',
        }}>
          <Logo />
          <DesktopNav />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton
              onClick={handleLanguageClick}
              sx={{ 
                color: '#666666',
                '&:hover': {
                  bgcolor: 'rgba(0, 255, 184, 0.1)',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              <LanguageIcon />
            </IconButton>
            <IconButton
              onClick={toggleDrawer}
              sx={{ 
                color: '#666666',
                '&:hover': {
                  bgcolor: 'rgba(0, 255, 184, 0.1)',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              <MenuIcon />
            </IconButton>
          </Box>
          <MobileNav />
          <UserMenu />
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar; 