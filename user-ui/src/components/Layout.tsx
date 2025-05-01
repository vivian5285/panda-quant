import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Box } from '@mui/material';
import UserNavbar from './common/UserNavbar';
import Navbar from './common/Navbar';
import { Footer } from './home';
import Breadcrumbs from './Breadcrumbs';
import { useAuth } from '../contexts/AuthContext';

interface LayoutProps {
  children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  const isHomePage = location.pathname === '/';

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: isHomePage ? 'transparent' : 'background.default',
      }}
    >
      {!isAuthPage && (
        isAuthenticated ? <UserNavbar /> : <Navbar />
      )}
      {!isHomePage && !isAuthPage && (
        <Box sx={{ bgcolor: 'background.paper', py: 2 }}>
          <Breadcrumbs />
        </Box>
      )}
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
          ...(isHomePage && {
            padding: 0,
          }),
        }}
      >
        {children || <Outlet />}
      </Box>
      {!isAuthPage && <Footer />}
    </Box>
  );
};

export default Layout; 