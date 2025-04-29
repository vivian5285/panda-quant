import { Router } from 'express';
import { commissionController } from '../controllers/commissionController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.post('/calculate', authMiddleware, commissionController.calculateCommission);
router.get('/history', authMiddleware, commissionController.getCommissionHistory);

export default router; 