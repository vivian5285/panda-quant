import React from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import GlobalBackground from '@/components/common/GlobalBackground';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import { GradientTitle } from '@/components/common/GradientTitle';

const UnauthorizedPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh' }}>
      <GlobalBackground />
      <Navbar />
      
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          minHeight: '60vh',
          textAlign: 'center'
        }}>
          <GradientTitle>
            未授权访问
          </GradientTitle>
          <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 1, mb: 4 }}>
            抱歉，您没有权限访问此页面
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/login')}
            sx={{
              bgcolor: '#00FFB8',
              color: 'white',
              '&:hover': {
                bgcolor: '#00E6A5',
              },
            }}
          >
            返回登录
          </Button>
        </Box>
      </Container>

      <Footer />
    </Box>
  );
};

export default UnauthorizedPage; 