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

  const drawer = (
    <Box
      sx={{
        width: 280,
        bgcolor: 'background.paper',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        p: 2,
        background: 'linear-gradient(135deg, rgba(0, 255, 184, 0.1) 0%, rgba(0, 0, 0, 0) 100%)',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Typography
          variant="h6"
          sx={{
            color: '#00FFB8',
            fontWeight: 700,
            fontSize: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <span style={{ fontSize: '1.8rem' }}>🐼</span>
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
        {['首页', '产品介绍', '使用流程', '关于我们'].map((text) => (
          <ListItem
            button
            key={text}
            component={Link}
            to={text === '首页' ? '/' : `/${text}`}
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
              primary={text}
              sx={{
                color: '#00FFB8',
                '& .MuiTypography-root': {
                  fontWeight: 500,
                  fontSize: '1.1rem',
                  fontFamily: '"PingFang SC", "Microsoft YaHei", sans-serif',
                },
              }}
            />
          </ListItem>
        ))}
      </List>
      <Box sx={{ mt: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Button
          variant="outlined"
          fullWidth
          component={Link}
          to="/login"
          sx={{
            borderColor: '#00FFB8',
            color: '#00FFB8',
            borderRadius: 2,
            py: 1,
            transition: 'all 0.3s ease',
            fontFamily: '"PingFang SC", "Microsoft YaHei", sans-serif',
            '&:hover': {
              borderColor: '#00CC93',
              bgcolor: 'rgba(0, 255, 184, 0.1)',
              transform: 'translateY(-2px)',
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
            color: '#000000',
            borderRadius: 2,
            py: 1,
            transition: 'all 0.3s ease',
            fontFamily: '"PingFang SC", "Microsoft YaHei", sans-serif',
            '&:hover': {
              bgcolor: '#00CC93',
              transform: 'translateY(-2px)',
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
        bgcolor: 'background.paper',
        boxShadow: 'none',
        borderBottom: '1px solid',
        borderColor: 'divider',
        background: 'linear-gradient(135deg, rgba(0, 255, 184, 0.05) 0%, rgba(0, 0, 0, 0) 100%)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <Container maxWidth="lg">
        <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 0, md: 2 } }}>
          <Box
            component={Link}
            to="/"
            sx={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
            }}
          >
            <Typography
              variant="h6"
              sx={{
                color: '#00FFB8',
                fontWeight: 700,
                fontSize: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <span style={{ fontSize: '1.8rem' }}>🐼</span>
              <span style={{
                background: 'linear-gradient(45deg, #00FFB8 30%, #00CC93 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                Panda Quant
              </span>
            </Typography>
          </Box>

          {isMobile ? (
            <>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{
                  color: '#00FFB8',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'rotate(90deg)',
                  },
                }}
              >
                <MenuIcon />
              </IconButton>
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
                    width: 280,
                  },
                }}
              >
                {drawer}
              </Drawer>
            </>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              {['首页', '产品介绍', '使用流程', '关于我们'].map((text) => (
                <Button
                  key={text}
                  component={Link}
                  to={text === '首页' ? '/' : `/${text}`}
                  sx={{
                    color: '#00FFB8',
                    fontWeight: 500,
                    position: 'relative',
                    fontSize: '1.1rem',
                    fontFamily: '"PingFang SC", "Microsoft YaHei", sans-serif',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: -2,
                      left: 0,
                      width: '100%',
                      height: 2,
                      bgcolor: '#00FFB8',
                      transform: 'scaleX(0)',
                      transition: 'transform 0.3s ease-in-out',
                    },
                    '&:hover::after': {
                      transform: 'scaleX(1)',
                    },
                    '&:hover': {
                      color: '#00CC93',
                    },
                  }}
                >
                  {text}
                </Button>
              ))}
              <Box sx={{ display: 'flex', gap: 2, ml: 2 }}>
                <Button
                  variant="outlined"
                  component={Link}
                  to="/login"
                  sx={{
                    borderColor: '#00FFB8',
                    color: '#00FFB8',
                    borderRadius: 2,
                    px: 3,
                    py: 1,
                    transition: 'all 0.3s ease',
                    fontFamily: '"PingFang SC", "Microsoft YaHei", sans-serif',
                    '&:hover': {
                      borderColor: '#00CC93',
                      bgcolor: 'rgba(0, 255, 184, 0.1)',
                      transform: 'translateY(-2px)',
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
                    color: '#000000',
                    borderRadius: 2,
                    px: 3,
                    py: 1,
                    transition: 'all 0.3s ease',
                    fontFamily: '"PingFang SC", "Microsoft YaHei", sans-serif',
                    '&:hover': {
                      bgcolor: '#00CC93',
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  注册
                </Button>
              </Box>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar; 