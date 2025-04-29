import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from "./theme";
import { AuthProvider } from './contexts/AuthContext';
import { SnackbarProvider } from './contexts/SnackbarContext';
import { LoadingProvider } from './contexts/LoadingContext';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import Layout from './components/Layout';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import UserManagement from './pages/UserManagement';
import OrderManagement from './pages/OrderManagement';
import CommissionList from './pages/CommissionList';
import CommissionSettlement from './pages/CommissionSettlement';
import ProfitList from './pages/ProfitList';
import WithdrawalReview from './pages/WithdrawalReview';
import SystemSettings from './pages/SystemSettings';
import LogManagement from './pages/LogManagement';
import UserStatusManagement from './pages/UserStatusManagement';
import ChainAddressManager from './pages/ChainAddressManager';
import PrivateRoute from './components/common/PrivateRoute';

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SnackbarProvider>
          <LoadingProvider>
            <AuthProvider>
              <Router>
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
                    <Route index element={<Navigate to="/users" replace />} />
                    <Route path="users" element={<UserManagement />} />
                    <Route path="orders" element={<OrderManagement />} />
                    <Route path="commissions" element={<CommissionList />} />
                    <Route path="commission-settlement" element={<CommissionSettlement />} />
                    <Route path="profits" element={<ProfitList />} />
                    <Route path="withdrawals" element={<WithdrawalReview />} />
                    <Route path="settings" element={<SystemSettings />} />
                    <Route path="logs" element={<LogManagement />} />
                    <Route path="user-status" element={<UserStatusManagement />} />
                    <Route path="chain-addresses" element={<ChainAddressManager />} />
                  </Route>
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Router>
            </AuthProvider>
          </LoadingProvider>
        </SnackbarProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App; 