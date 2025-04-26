import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  useTheme,
  useMediaQuery,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Container,
} from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const Navbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navItems = [
    { label: '产品介绍', path: '/product' },
    { label: '收益榜', path: '/profit' },
    { label: '量化策略', path: '/product/strategies' },
    { label: '安全保障', path: '/security' },
    { label: '邀请返佣', path: '/invite' },
  ];

  const drawer = (
    <Box
      sx={{
        width: { xs: '100%', sm: 280 },
        bgcolor: 'background.paper',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        p: { xs: 1.5, sm: 2 },
        background: 'linear-gradient(135deg, rgba(0, 255, 184, 0.1) 0%, rgba(0, 0, 0, 0) 100%)',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: { xs: 2, sm: 3 } }}>
        <Typography
          variant="h6"
          sx={{
            color: '#00FFB8',
            fontWeight: 700,
            fontSize: { xs: '1.2rem', sm: '1.5rem' },
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <span style={{ fontSize: '1.5rem' }}>🐼</span>
          <span style={{
            background: 'linear-gradient(45deg, #00FFB8 30%, #00CC93 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Panda Quant
          </span>
        </Typography>
      </Box>
      <List>
        {navItems.map((item) => (
          <ListItem
            button
            key={item.label}
            component={Link}
            to={item.path}
            sx={{
              mb: 1,
              borderRadius: 2,
              transition: 'all 0.3s ease',
              '&:hover': {
                bgcolor: 'rgba(0, 255, 184, 0.15)',
                transform: 'translateX(5px)',
              },
            }}
          >
            <ListItemText
              primary={item.label}
              sx={{
                color: '#00FFB8',
                '& .MuiTypography-root': {
                  fontWeight: 500,
                  fontSize: { xs: '1rem', sm: '1.1rem' },
                  fontFamily: '"PingFang SC", "Microsoft YaHei", sans-serif',
                },
              }}
            />
          </ListItem>
        ))}
      </List>
      <Box sx={{ mt: 'auto', display: 'flex', flexDirection: 'column', gap: { xs: 1.5, sm: 2 } }}>
        <Button
          variant="outlined"
          fullWidth
          component={Link}
          to="/login"
          sx={{
            color: '#00FFB8',
            borderColor: '#00FFB8',
            '&:hover': {
              borderColor: '#00CC93',
              backgroundColor: 'rgba(0, 255, 184, 0.1)',
            },
          }}
        >
          登录
        </Button>
        <Button
          variant="contained"
          fullWidth
          component={Link}
          to="/register"
          sx={{
            bgcolor: '#00FFB8',
            color: 'white',
            '&:hover': {
              bgcolor: '#00CC93',
            },
          }}
        >
          注册
        </Button>
      </Box>
    </Box>
  );

  return (
    <AppBar
      position="sticky"
      sx={{
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
        boxShadow: 'none',
        borderBottom: '1px solid rgba(0, 255, 184, 0.1)',
      }}
    >
      <Container maxWidth="lg">
        <Toolbar sx={{ px: { xs: 1.5, sm: 2, md: 3 } }}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleDrawerToggle}
            sx={{ 
              mr: 2,
              display: { md: 'none' },
              color: '#00FFB8',
            }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
            <Typography
              variant="h6"
              sx={{
                color: '#00FFB8',
                fontWeight: 700,
                fontSize: { xs: '1.2rem', sm: '1.5rem' },
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <span style={{ fontSize: '1.5rem' }}>🐼</span>
              <span style={{
                background: 'linear-gradient(45deg, #00FFB8 30%, #00CC93 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                Panda Quant
              </span>
            </Typography>
          </Box>
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 3, justifyContent: 'center', flex: 1 }}>
            {navItems.map((item) => (
              <Button
                key={item.label}
                component={Link}
                to={item.path}
                sx={{
                  color: '#00FFB8',
                  fontWeight: 600,
                  fontSize: '1rem',
                  textAlign: 'center',
                  '&:hover': {
                    color: '#00CC93',
                    backgroundColor: 'rgba(0, 255, 184, 0.1)',
                  },
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2, ml: 2 }}>
            <Button
              variant="outlined"
              component={Link}
              to="/login"
              sx={{
                color: '#00FFB8',
                borderColor: '#00FFB8',
                '&:hover': {
                  borderColor: '#00CC93',
                  backgroundColor: 'rgba(0, 255, 184, 0.1)',
                },
              }}
            >
              登录
            </Button>
            <Button
              variant="contained"
              component={Link}
              to="/register"
              sx={{
                bgcolor: '#00FFB8',
                color: 'white',
                '&:hover': {
                  bgcolor: '#00CC93',
                },
              }}
            >
              注册
            </Button>
          </Box>
        </Toolbar>
      </Container>
      <Drawer
        variant="temporary"
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: { xs: '100%', sm: 280 },
          },
        }}
      >
        {drawer}
      </Drawer>
    </AppBar>
  );
};

export default Navbar; 