import { RouteObject } from 'react-router-dom';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import HomePage from '../pages/HomePage';
import PrivateRoute from '../components/PrivateRoute';
import Layout from '../components/Layout';
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

// 导入页脚相关页面
import AboutPage from '../pages/About';
import TeamPage from '../pages/about/team';
import NewsPage from '../pages/about/news';
import ContactPage from '../pages/about/contact';
import PartnersPage from '../pages/about/partners';
import DisclaimerPage from '../pages/legal/disclaimer';
import PrivacyPage from '../pages/legal/privacy';
import TermsPage from '../pages/legal/terms';
import RiskPage from '../pages/legal/risk';
import HelpPage from '../pages/resources/help';
import BlogPage from '../pages/resources/blog';
import CommunityPage from '../pages/resources/community';

// 导入新增页面
import ProductPage from '../pages/product';
import PricingPage from '../pages/product/pricing';
import ApiPage from '../pages/product/api';
import QuantPage from '../pages/product/quant';
import StrategiesPage from '../pages/product/strategies';
import UserStatusList from '../pages/UserStatusList';
import PaymentPage from '../pages/PaymentPage';
import Loading from '../pages/Loading';
import Unauthorized from '../pages/Unauthorized';
import ProfitPage from '../pages/product/profit';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/login',
    element: <AuthLayout><Login /></AuthLayout>,
  },
  {
    path: '/register',
    element: <AuthLayout><Register /></AuthLayout>,
  },
  {
    path: '/dashboard',
    element: (
      <PrivateRoute>
        <Layout>
          <Dashboard user={{ username: '', email: '' }} />
        </Layout>
      </PrivateRoute>
    ),
  },
  {
    path: '/strategies',
    element: (
      <PrivateRoute>
        <Layout>
          <StrategyManagement />
        </Layout>
      </PrivateRoute>
    ),
  },
  {
    path: '/strategies/:id',
    element: (
      <PrivateRoute>
        <Layout>
          <StrategyDetail />
        </Layout>
      </PrivateRoute>
    ),
  },
  {
    path: '/api-management',
    element: (
      <PrivateRoute>
        <Layout>
          <ApiManagement />
        </Layout>
      </PrivateRoute>
    ),
  },
  {
    path: '/api-management/security',
    element: (
      <PrivateRoute>
        <Layout>
          <ApiSecuritySettings />
        </Layout>
      </PrivateRoute>
    ),
  },
  {
    path: '/account-settings',
    element: (
      <PrivateRoute>
        <Layout>
          <AccountSettings />
        </Layout>
      </PrivateRoute>
    ),
  },
  {
    path: '/account-settings/profile',
    element: (
      <PrivateRoute>
        <Layout>
          <Profile />
        </Layout>
      </PrivateRoute>
    ),
  },
  {
    path: '/account-settings/security',
    element: (
      <PrivateRoute>
        <Layout>
          <TwoFactorAuth />
        </Layout>
      </PrivateRoute>
    ),
  },
  {
    path: '/deposit',
    element: (
      <PrivateRoute>
        <Layout>
          <Deposit />
        </Layout>
      </PrivateRoute>
    ),
  },
  {
    path: '/withdraw',
    element: (
      <PrivateRoute>
        <Layout>
          <Withdraw />
        </Layout>
      </PrivateRoute>
    ),
  },
  {
    path: '/messages',
    element: (
      <PrivateRoute>
        <Layout>
          <MessageCenter />
        </Layout>
      </PrivateRoute>
    ),
  },
  {
    path: '/messages/:id',
    element: (
      <PrivateRoute>
        <Layout>
          <MessageDetail />
        </Layout>
      </PrivateRoute>
    ),
  },
  {
    path: '/invite',
    element: (
      <PrivateRoute>
        <Layout>
          <Invite />
        </Layout>
      </PrivateRoute>
    ),
  },
  {
    path: '/referral/rewards',
    element: (
      <PrivateRoute>
        <Layout>
          <ReferralRewards />
        </Layout>
      </PrivateRoute>
    ),
  },
  {
    path: '/referral/link',
    element: (
      <PrivateRoute>
        <Layout>
          <ReferralLink />
        </Layout>
      </PrivateRoute>
    ),
  },
  {
    path: '/about',
    element: <AboutPage />,
  },
  {
    path: '/about/team',
    element: <TeamPage />,
  },
  {
    path: '/about/news',
    element: <NewsPage />,
  },
  {
    path: '/about/contact',
    element: <ContactPage />,
  },
  {
    path: '/about/partners',
    element: <PartnersPage />,
  },
  {
    path: '/legal/disclaimer',
    element: <DisclaimerPage />,
  },
  {
    path: '/legal/privacy',
    element: <PrivacyPage />,
  },
  {
    path: '/legal/terms',
    element: <TermsPage />,
  },
  {
    path: '/legal/risk',
    element: <RiskPage />,
  },
  {
    path: '/resources/help',
    element: <HelpPage />,
  },
  {
    path: '/resources/blog',
    element: <BlogPage />,
  },
  {
    path: '/resources/community',
    element: <CommunityPage />,
  },
  {
    path: '/product',
    element: <ProductPage />,
  },
  {
    path: '/product/pricing',
    element: <PricingPage />,
  },
  {
    path: '/product/api',
    element: <ApiPage />,
  },
  {
    path: '/product/quant',
    element: <QuantPage />,
  },
  {
    path: '/product/strategies',
    element: <StrategiesPage />,
  },
  {
    path: '/user-status',
    element: (
      <PrivateRoute>
        <Layout>
          <UserStatusList />
        </Layout>
      </PrivateRoute>
    ),
  },
  {
    path: '/payment',
    element: (
      <PrivateRoute>
        <Layout>
          <PaymentPage />
        </Layout>
      </PrivateRoute>
    ),
  },
  {
    path: '/loading',
    element: <Loading />,
  },
  {
    path: '/unauthorized',
    element: <Unauthorized />,
  },
  {
    path: '/product/profit',
    element: <ProfitPage />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
]; 