import { RouteObject } from 'react-router-dom';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import HomePage from '../pages/HomePage';
import PrivateRoute from '../components/PrivateRoute';
import Layout from '../components/Layout';
import AuthLayout from '../components/AuthLayout';

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
          <Dashboard />
        </Layout>
      </PrivateRoute>
    ),
  },
]; 