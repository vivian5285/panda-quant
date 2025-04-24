import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

const TeamPage = lazy(() => import('./pages/TeamPage'));
const CommissionPage = lazy(() => import('./pages/CommissionPage'));

export const routes: RouteObject[] = [
  // ... existing routes ...
  {
    path: '/team',
    element: <TeamPage />,
  },
  {
    path: '/commission',
    element: <CommissionPage />,
  },
]; 