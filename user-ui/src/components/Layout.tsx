import React from 'react';
import { useLocation } from 'react-router-dom';
import { Box } from '@mui/material';
import Navbar from './home/Navbar';
import Footer from './home/Footer';
import { Outlet } from 'react-router-dom';

interface LayoutProps {
  children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  const isHomePage = location.pathname === '/';

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {!isAuthPage && <Navbar />}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          ...(isAuthPage && {
            justifyContent: 'center',
            alignItems: 'center',
          }),
        }}
      >
        <Outlet />
      </Box>
      {!isAuthPage && <Footer />}
    </Box>
  );
};

export default Layout; 