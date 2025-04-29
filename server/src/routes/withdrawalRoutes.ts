import { Router } from 'express';
import { withdrawalController } from '../controllers/withdrawalController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// User routes
router.post('/', authMiddleware, withdrawalController.createWithdrawal);
router.get('/', authMiddleware, withdrawalController.getWithdrawals);
router.patch('/:id/status', authMiddleware, withdrawalController.updateWithdrawalStatus);

// Admin routes
router.get('/pending', authMiddleware, withdrawalController.getPendingWithdrawals);
router.post('/:withdrawalId/process', authMiddleware, withdrawalController.processWithdrawal);
router.post('/:withdrawalId/complete', authMiddleware, withdrawalController.completeWithdrawal);
router.get('/stats', authMiddleware, withdrawalController.getWithdrawalStats);

export default router; 