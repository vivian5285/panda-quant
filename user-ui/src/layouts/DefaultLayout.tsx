import React, { Suspense } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import GlobalBackground from '../components/common/GlobalBackground';

const LoadingSpinner = () => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      width: '100vw',
      position: 'fixed',
      top: 0,
      left: 0,
      backgroundColor: 'background.default',
      zIndex: 9999,
    }}
  >
    <CircularProgress />
  </Box>
);

const DefaultLayout: React.FC = () => {
  console.log('DefaultLayout rendered');
  
  return (
    <Box sx={{ 
      position: 'relative', 
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'background.default',
    }}>
      <GlobalBackground />
      <Navbar />
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          overflow: 'visible',
          backgroundColor: 'background.default',
        }}
      >
        <Suspense fallback={<LoadingSpinner />}>
          <Outlet />
        </Suspense>
      </Box>
      <Footer />
    </Box>
  );
};

export default DefaultLayout; 