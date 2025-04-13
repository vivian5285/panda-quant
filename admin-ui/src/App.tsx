import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box, useTheme, useMediaQuery } from '@mui/material';
import { theme } from './theme';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import './styles/responsive.css';

// Layout Components
import Header from './components/Header';
import Footer from './components/Footer';
import MobileMenu from './components/MobileMenu';
import Sidebar from './components/Sidebar';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import UserManagement from './pages/UserManagement';
import ChainAddressManagement from './pages/ChainAddressManagement';
import UserStatusManagement from './pages/UserStatusManagement';
import NotFound from './pages/NotFound';

const AppContent: React.FC = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Box sx={{ display: 'flex', flex: 1 }}>
        {!isMobile && <Sidebar />}
        <Box 
          component="main" 
          sx={{ 
            flexGrow: 1, 
            p: 3,
            width: { sm: `calc(100% - 240px)` },
            ml: { sm: '240px' }
          }}
        >
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/users" element={<UserManagement />} />
            <Route path="/chains" element={<ChainAddressManagement />} />
            <Route path="/user-status" element={<UserStatusManagement />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Box>
      </Box>
      <Footer />
      {isMobile && <MobileMenu />}
    </Box>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <I18nextProvider i18n={i18n}>
        <AuthProvider>
          <Router>
            <AppContent />
          </Router>
        </AuthProvider>
      </I18nextProvider>
    </ThemeProvider>
  );
};

export default App; 