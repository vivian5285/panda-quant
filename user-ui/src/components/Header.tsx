import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <AppBar position="static" sx={{ bgcolor: '#4CAF50' }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          熊猫量化
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button color="inherit" onClick={() => navigate('/')}>
            首页
          </Button>
          {isAuthenticated ? (
            <>
              <Button color="inherit" onClick={() => navigate('/asset-center')}>
                资产中心
              </Button>
              <Button color="inherit" onClick={() => navigate('/profile')}>
                个人中心
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" onClick={() => navigate('/login')}>
                登录
              </Button>
              <Button color="inherit" onClick={() => navigate('/register')}>
                注册
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header; 