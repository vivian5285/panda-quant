import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import { theme } from './theme';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import UserManagement from './pages/UserManagement';
import StrategyManagement from './pages/StrategyManagement';
import ChainAddressManager from './pages/ChainAddressManager';
import WithdrawalReview from './pages/WithdrawalReview';

const App: React.FC = () => {
  return (
    <I18nextProvider i18n={i18n}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<Layout />}>
                <Route index element={<Dashboard />} />
                <Route path="users" element={<UserManagement />} />
                <Route path="strategies" element={<StrategyManagement />} />
                <Route path="chains" element={<ChainAddressManager />} />
                <Route path="withdrawals" element={<WithdrawalReview />} />
              </Route>
            </Routes>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </I18nextProvider>
  );
};

export default App; 