import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Button,
  MenuItem,
  useTheme,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LanguageIcon from '@mui/icons-material/Language';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { themeUtils } from '../../theme';

const Header: React.FC = () => {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [anchorElLang, setAnchorElLang] = useState<null | HTMLElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navItems = [
    { name: '首页', path: '/' },
    { name: '策略', path: '/strategies' },
    { name: '收益', path: '/profit' },
    { name: '邀请', path: '/invite' },
    { name: '关于', path: '/about' },
  ];

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleOpenLangMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElLang(event.currentTarget);
  };

  const handleCloseLangMenu = () => {
    setAnchorElLang(null);
  };

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
    handleCloseLangMenu();
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    handleCloseNavMenu();
    setMobileOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        熊猫量化
      </Typography>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem
            key={item.name}
            onClick={() => handleNavigation(item.path)}
            sx={{
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            <ListItemText primary={item.name} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <AppBar
      position="fixed"
      sx={{
        background: scrolled
          ? 'rgba(0, 0, 0, 0.8)'
          : 'linear-gradient(180deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)',
        backdropFilter: 'blur(10px)',
        boxShadow: 'none',
        transition: 'all 0.3s ease',
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
              cursor: 'pointer',
            }}
            onClick={() => handleNavigation('/')}
          >
            熊猫量化
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleDrawerToggle}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
          </Box>

          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              flexGrow: 1,
              display: { xs: 'flex', md: 'none' },
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
              cursor: 'pointer',
            }}
            onClick={() => handleNavigation('/')}
          >
            熊猫量化
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {navItems.map((item) => (
              <motion.div
                key={item.name}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={() => handleNavigation(item.path)}
                  sx={{
                    my: 2,
                    color: 'white',
                    display: 'block',
                    position: 'relative',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: 0,
                      left: '50%',
                      width: '0%',
                      height: '2px',
                      backgroundColor: theme.palette.primary.main,
                      transition: 'all 0.3s ease',
                      transform: 'translateX(-50%)',
                    },
                    '&:hover::after': {
                      width: '100%',
                    },
                  }}
                >
                  {item.name}
                </Button>
              </motion.div>
            ))}
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton
              size="large"
              aria-label="language"
              aria-controls="language-menu"
              aria-haspopup="true"
              onClick={handleOpenLangMenu}
              color="inherit"
            >
              <LanguageIcon />
            </IconButton>
            <Menu
              id="language-menu"
              anchorEl={anchorElLang}
              open={Boolean(anchorElLang)}
              onClose={handleCloseLangMenu}
            >
              <MenuItem onClick={() => handleLanguageChange('zh')}>中文</MenuItem>
              <MenuItem onClick={() => handleLanguageChange('en')}>English</MenuItem>
            </Menu>

            <Button
              variant="contained"
              onClick={() => handleNavigation('/login')}
              sx={themeUtils.buttonStyles(theme).contained}
            >
              登录
            </Button>
            <Button
              variant="outlined"
              onClick={() => handleNavigation('/register')}
              sx={themeUtils.buttonStyles(theme).outlined}
            >
              注册
            </Button>
          </Box>
        </Toolbar>
      </Container>

      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 240,
            background: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(10px)',
          },
        }}
      >
        {drawer}
      </Drawer>
    </AppBar>
  );
};

export default Header; 