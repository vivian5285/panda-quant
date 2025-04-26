import React from 'react';
import { RouteObject, Navigate } from 'react-router-dom';
import Login from '../pages/login';
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

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />
      },
      {
        path: 'login',
        element: <AuthLayout><Login /></AuthLayout>
      },
      {
        path: 'register',
        element: <AuthLayout><Register /></AuthLayout>
      },
      {
        path: 'dashboard',
        element: (
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        )
      },
      {
        path: 'product',
        element: <ProductPage />
      },
      {
        path: 'product/strategies',
        element: <StrategiesPage />
      },
      {
        path: 'product/quant',
        element: <QuantPage />
      },
      {
        path: 'product/api',
        element: <ApiPage />
      },
      {
        path: 'product/pricing',
        element: <PricingPage />
      },
      {
        path: 'profit',
        element: <ProfitPage />
      },
      {
        path: 'my-strategies',
        element: (
          <PrivateRoute>
            <StrategyManagement />
          </PrivateRoute>
        )
      },
      {
        path: 'my-strategies/:id',
        element: (
          <PrivateRoute>
            <StrategyDetail />
          </PrivateRoute>
        )
      },
      {
        path: 'security',
        element: <ApiSecuritySettings />,
        children: [
          {
            path: 'api',
            element: (
              <PrivateRoute>
                <ApiManagement />
              </PrivateRoute>
            )
          },
          {
            path: 'settings',
            element: (
              <PrivateRoute>
                <ApiSecuritySettings />
              </PrivateRoute>
            )
          }
        ]
      },
      {
        path: 'invite',
        element: <Invite />,
        children: [
          {
            path: 'rewards',
            element: (
              <PrivateRoute>
                <ReferralRewards />
              </PrivateRoute>
            )
          },
          {
            path: 'link',
            element: (
              <PrivateRoute>
                <ReferralLink />
              </PrivateRoute>
            )
          }
        ]
      },
      {
        path: 'account',
        element: (
          <PrivateRoute>
            <AccountSettings />
          </PrivateRoute>
        ),
        children: [
          {
            path: 'profile',
            element: <Profile />
          },
          {
            path: 'security',
            element: <TwoFactorAuth />
          }
        ]
      },
      {
        path: 'wallet',
        element: (
          <PrivateRoute>
            <Deposit />
          </PrivateRoute>
        ),
        children: [
          {
            path: 'deposit',
            element: <Deposit />
          },
          {
            path: 'withdraw',
            element: <Withdraw />
          }
        ]
      },
      {
        path: 'messages',
        element: (
          <PrivateRoute>
            <MessageCenter />
          </PrivateRoute>
        ),
        children: [
          {
            path: ':id',
            element: <MessageDetail />
          }
        ]
      },
      {
        path: 'about',
        element: <AboutPage />
      },
      {
        path: 'team',
        element: <TeamPage />
      },
      {
        path: 'careers',
        element: <Navigate to="/company/careers" replace />
      },
      {
        path: 'company/careers',
        element: <CareersPage />
      },
      {
        path: 'partners',
        element: <PartnersPage />
      },
      {
        path: 'contact',
        element: <ContactPage />
      },
      {
        path: 'news',
        element: <NewsPage />
      },
      {
        path: 'legal',
        children: [
          {
            path: 'disclaimer',
            element: <DisclaimerPage />
          },
          {
            path: 'privacy',
            element: <PrivacyPage />
          },
          {
            path: 'terms',
            element: <TermsPage />
          },
          {
            path: 'risk',
            element: <RiskPage />
          },
          {
            path: 'cookies',
            element: <CookiesPolicy />
          },
          {
            path: 'service-terms',
            element: <TermsPage />
          },
          {
            path: 'privacy-policy',
            element: <PrivacyPage />
          },
          {
            path: 'risk-warning',
            element: <RiskPage />
          },
          {
            path: 'footer/terms',
            element: <TermsPage />
          },
          {
            path: 'footer/privacy',
            element: <PrivacyPage />
          },
          {
            path: 'footer/risk',
            element: <RiskPage />
          }
        ]
      },
      {
        path: 'resources',
        element: <ResourceLayout />,
        children: [
          {
            path: 'help',
            element: <HelpPage />
          },
          {
            path: 'blog',
            element: <BlogPage />
          },
          {
            path: 'community',
            element: <CommunityPage />
          },
          {
            path: 'changelog',
            element: <ChangelogPage />
          }
        ]
      },
      {
        path: '*',
        element: <NotFound />
      }
    ]
  }
]; 