import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, UNSAFE_NavigationContext as NavigationContext } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import { Web3Provider } from './contexts/Web3Context';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
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

// 启用 React Router v7 的未来标志
const router = {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true,
  },
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <CssBaseline />
      <Web3Provider>
        <AuthProvider>
          <I18nextProvider i18n={i18n}>
            <Router {...router}>
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