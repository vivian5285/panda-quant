import { Router } from 'express';
import userRoutes from './user';
import assetRoutes from './assetRoutes';
import authRoutes from './auth';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/assets', assetRoutes);

export default router; 