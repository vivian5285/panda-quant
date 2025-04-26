import React from 'react';
import { useLocation } from 'react-router-dom';
import { Box } from '@mui/material';
import UserNavbar from './common/UserNavbar';
import Footer from './home/Footer';
import { Outlet } from 'react-router-dom';
import Breadcrumbs from './Breadcrumbs';

interface LayoutProps {
  children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
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
      {!isAuthPage && <UserNavbar />}
      {!isHomePage && (
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
        }}
      >
        {children || <Outlet />}
      </Box>
      {!isAuthPage && <Footer />}
    </Box>
  );
};

export default Layout; 