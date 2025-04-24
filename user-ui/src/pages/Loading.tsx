import React from 'react';
import { Box, Container, Typography, CircularProgress } from '@mui/material';
import GlobalBackground from '@/components/common/GlobalBackground';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import GradientTitle from '@/components/common/GradientTitle';

const LoadingPage: React.FC = () => {
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
            加载中
          </GradientTitle>
          <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 1, mb: 4 }}>
            请稍候，正在加载内容...
          </Typography>
          <CircularProgress 
            size={60} 
            sx={{ 
              color: '#00FFB8',
              animationDuration: '1.5s',
            }} 
          />
        </Box>
      </Container>

      <Footer />
    </Box>
  );
};

export default LoadingPage; 