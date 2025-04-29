import { Router } from 'express';
import { commissionController } from '../controllers/commissionController';
import { auth } from '../middleware/auth';

const router = Router();

router.post('/', auth, commissionController.createCommission);
router.get('/', auth, commissionController.getCommissions);
router.get('/stats', auth, commissionController.getCommissionStats);

export default router; 