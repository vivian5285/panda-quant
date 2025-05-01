import React from 'react';
import { Routes as RouterRoutes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import HomePage from '../pages/HomePage';
import PrivateRoute from '../components/PrivateRoute';
import Layout from '../components/Layout';
import ResourceLayout from '../components/common/ResourceLayout';
import AuthLayout from '../components/AuthLayout';
import StrategyManagement from '../pages/StrategyManagement';
import StrategyDetail from '../pages/StrategyDetail';
import ApiManagement from '../pages/ApiManagement';
import ApiSecuritySettings from '../pages/ApiSecuritySettings';
import AccountSettings from '../pages/AccountSettings';
import Profile from '../pages/Profile';
import TwoFactorAuth from '../pages/TwoFactorAuth';
import Deposit from '../pages/Deposit';
import Withdraw from '../pages/Withdraw';
import MessageCenter from '../pages/MessageCenter';
import MessageDetail from '../pages/MessageDetail';
import Invite from '../pages/Invite';
import ReferralRewards from '../pages/ReferralRewards';
import ReferralLink from '../pages/ReferralLink';
import NotFound from '../pages/NotFound';
import AboutPage from '../pages/About';
import TeamPage from '../pages/about/team';
import NewsPage from '../pages/news';
import ContactPage from '../pages/about/contact';
import PartnersPage from '../pages/about/partners';
import CareersPage from '../pages/company/careers';
import DisclaimerPage from '../pages/legal/disclaimer';
import PrivacyPage from '../pages/legal/privacy';
import TermsPage from '../pages/legal/terms';
import RiskPage from '../pages/legal/risk';
import HelpPage from '../pages/resources/help';
import BlogPage from '../pages/resources/blog';
import CommunityPage from '../pages/resources/community';
import ProductPage from '../pages/product';
import PricingPage from '../pages/product/pricing';
import ApiPage from '../pages/product/api';
import QuantPage from '../pages/product/quant';
import StrategiesPage from '../pages/product/strategies';
import ProfitPage from '../pages/product/profit';
import Loading from '../pages/Loading';
import Unauthorized from '../pages/Unauthorized';
import BlogDetailPage from '../pages/resources/blog/[id]';
import ChangelogPage from '../pages/resources/changelog';
import CookiesPolicy from '../pages/legal/cookies';
import { useAuth } from '../contexts/AuthContext';

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <RouterRoutes>
      <Route path="/" element={<HomePage />} />
      <Route path="/dashboard" element={<PrivateRoute><Dashboard user={user} /></PrivateRoute>} />
      {/* ... rest of the routes ... */}
    </RouterRoutes>
  );
};

export const routes = [
  {
    path: '/',
    element: <HomePage />
  },
  {
    path: '/dashboard',
    element: <PrivateRoute><Dashboard /></PrivateRoute>
  },
  // ... rest of the routes ...
];

export default routes; 