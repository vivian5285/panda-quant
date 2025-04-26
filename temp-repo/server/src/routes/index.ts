import { Router } from 'express';
import userRoutes from './user';
import adminRoutes from './admin';
import strategyRoutes from './strategy';

const router = Router();

// API 版本控制
router.use('/api/v1', [
  userRoutes,
  adminRoutes,
  strategyRoutes
]);

export default router; 