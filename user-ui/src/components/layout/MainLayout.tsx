import React from 'react';
import { Box } from '@mui/material';
import Navbar from '../home/Navbar';
import Footer from '../home/Footer';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <Box sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      background: 'linear-gradient(135deg, rgba(0, 255, 184, 0.05) 0%, rgba(0, 255, 184, 0.02) 100%)',
    }}>
      <Navbar />
      <Box sx={{ 
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        maxWidth: '1200px',
        mx: 'auto',
        px: { xs: 1.5, sm: 2, md: 4 },
        py: { xs: 2, sm: 3, md: 4 },
        position: 'relative',
        zIndex: 1,
        overflow: 'hidden',
      }}>
        {children}
      </Box>
      <Footer />
    </Box>
  );
};

export default MainLayout; 