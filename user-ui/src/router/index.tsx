import { createBrowserRouter } from 'react-router-dom';
import UserCommissionView from '../components/commission/UserCommissionView';

// ... 其他路由配置 ...

export const router = createBrowserRouter([
  // ... 其他路由 ...
  {
    path: '/commission',
    element: <UserCommissionView />,
    meta: {
      requiresAuth: true
    }
  }
]); 