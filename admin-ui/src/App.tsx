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
import UserStatusManagement from './pages/UserStatusManagement';
import CommissionList from './pages/CommissionList';
import ProfitList from './pages/ProfitList';
import CommissionSettlement from './pages/CommissionSettlement';
import EducationPage from './pages/EducationPage';
import ABTestingPage from './pages/ABTestingPage';
import MonitoringPage from './pages/MonitoringPage';
import SettingsPage from './pages/SettingsPage';
import LogsPage from './pages/LogsPage';
import NotFound from './pages/NotFound';

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
                <Route path="user-status" element={<UserStatusManagement />} />
                <Route path="commissions" element={<CommissionList />} />
                <Route path="profits" element={<ProfitList />} />
                <Route path="commission-settlement" element={<CommissionSettlement />} />
                <Route path="education" element={<EducationPage />} />
                <Route path="ab-testing" element={<ABTestingPage />} />
                <Route path="monitoring" element={<MonitoringPage />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="logs" element={<LogsPage />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </I18nextProvider>
  );
};

export default App; 