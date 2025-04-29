import { Router } from 'express';
import { CommissionController } from '../controllers/commissionController';
import { authMiddleware } from '../middleware/auth';

const router = Router();
const commissionController = new CommissionController();

router.post('/', authMiddleware, (req, res) => commissionController.createCommission(req, res));
router.get('/history', authMiddleware, (req, res) => commissionController.getCommissionHistory(req, res));
router.get('/total', authMiddleware, (req, res) => commissionController.getTotalCommission(req, res));
router.post('/distribute', authMiddleware, (req, res) => commissionController.distributeCommission(req, res));

export default router; 