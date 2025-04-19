import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { createCustomTheme } from './theme';
import { Web3Provider } from './contexts/Web3Context';
import { AuthProvider } from './contexts/AuthContext';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';

const App: React.FC = () => {
  const theme = createCustomTheme('light');

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Web3Provider>
        <AuthProvider>
          <I18nextProvider i18n={i18n}>
            <Router>
              <Routes>
                {/* 需要布局的页面 */}
                <Route path="/" element={<Layout />}>
                  <Route index element={<HomePage />} />
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="settings" element={<Settings />} />
                </Route>

                {/* 不需要布局的页面 */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/404" element={<NotFound />} />
                <Route path="*" element={<Navigate to="/404" replace />} />
              </Routes>
            </Router>
          </I18nextProvider>
        </AuthProvider>
      </Web3Provider>
    </ThemeProvider>
  );
};

export default App; 