import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';
import HomePage from './pages/HomePage';
import StrategyDetail from './pages/StrategyDetail';
import AssetCenter from './pages/AssetCenter';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {children}
    </Box>
  );
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout><HomePage /></Layout>} />
      <Route path="/strategy/:id" element={<Layout><StrategyDetail /></Layout>} />
      <Route path="/asset-center" element={<Layout><AssetCenter /></Layout>} />
      <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
      <Route path="/login" element={<Layout><Login /></Layout>} />
      <Route path="/register" element={<Layout><Register /></Layout>} />
      <Route path="*" element={<Layout><NotFound /></Layout>} />
    </Routes>
  );
};

export default AppRoutes; 