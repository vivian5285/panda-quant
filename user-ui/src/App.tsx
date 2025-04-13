import React, { Suspense } from 'react';
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
import ErrorBoundary from './components/ErrorBoundary';
import LoadingSpinner from './components/LoadingSpinner';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import MessageCenter from './pages/MessageCenter';
import NotFound from './pages/NotFound';
import Home from './pages/Home';
import DepositCreate from './pages/DepositCreate';
import DepositConfirm from './pages/DepositConfirm';
import AssetCenter from './pages/AssetCenter';
import MyProfit from './pages/MyProfit';
import BacktestConfig from './pages/BacktestConfig';
import BacktestResults from './pages/BacktestResults';
import Withdraw from './pages/Withdraw';
import SelectStrategy from './pages/SelectStrategy';

const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <ErrorBoundary>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        <Box sx={{ display: 'flex', flex: 1 }}>
          {!isMobile && isAuthenticated && <Sidebar />}
          <Box 
            component="main" 
            sx={{ 
              flexGrow: 1, 
              p: 3,
              width: { sm: `calc(100% - 240px)` },
              ml: { sm: '240px' },
              mt: '64px'
            }}
          >
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
                <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/" />} />
                <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
                <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} />
                <Route path="/settings" element={isAuthenticated ? <Settings /> : <Navigate to="/login" />} />
                <Route path="/notifications" element={isAuthenticated ? <MessageCenter /> : <Navigate to="/login" />} />
                <Route path="/asset-center" element={isAuthenticated ? <AssetCenter /> : <Navigate to="/login" />} />
                <Route path="/deposit/create" element={isAuthenticated ? <DepositCreate /> : <Navigate to="/login" />} />
                <Route path="/deposit/confirm" element={isAuthenticated ? <DepositConfirm /> : <Navigate to="/login" />} />
                <Route path="/withdraw" element={isAuthenticated ? <Withdraw /> : <Navigate to="/login" />} />
                <Route path="/profit" element={isAuthenticated ? <MyProfit /> : <Navigate to="/login" />} />
                <Route path="/backtest/config" element={isAuthenticated ? <BacktestConfig /> : <Navigate to="/login" />} />
                <Route path="/backtest/select" element={isAuthenticated ? <SelectStrategy /> : <Navigate to="/login" />} />
                <Route path="/backtest/results/:id" element={isAuthenticated ? <BacktestResults /> : <Navigate to="/login" />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </Box>
        </Box>
        <Footer />
        {isMobile && isAuthenticated && <MobileMenu />}
      </Box>
    </ErrorBoundary>
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