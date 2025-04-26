import React from 'react';
import { Box } from '@mui/material';
import Navbar from './Navbar';
import Footer from './Footer';
import GlobalBackground from './GlobalBackground';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Box sx={{ 
      position: 'relative', 
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <GlobalBackground />
      <Navbar />
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          zIndex: 1
        }}
      >
        {children}
      </Box>
      <Footer />
    </Box>
  );
};

export default Layout; 