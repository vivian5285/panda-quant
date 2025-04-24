import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

const CommissionPage = lazy(() => import('./pages/CommissionPage'));

export const routes: RouteObject[] = [
  // ... existing routes ...
  {
    path: '/commission',
    element: <CommissionPage />,
  },
]; 