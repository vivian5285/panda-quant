import { Router } from 'express';
import userRoutes from './userRoutes';
import strategyRoutes from './strategyRoutes';
import assetRoutes from './assetRoutes';

const router = Router();

router.use('/users', userRoutes);
router.use('/strategies', strategyRoutes);
router.use('/assets', assetRoutes);

export default router; 