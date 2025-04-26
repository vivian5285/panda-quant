import { Router } from 'express';
import { withdrawalController } from '../controllers/withdrawalController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// User routes
router.post('/', authenticate, withdrawalController.createWithdrawal);
router.get('/history', authenticate, withdrawalController.getWithdrawalHistory);

// Admin routes
router.get('/pending', authenticate, authorize(['admin']), withdrawalController.getPendingWithdrawals);
router.post('/:withdrawalId/process', authenticate, authorize(['admin']), withdrawalController.processWithdrawal);
router.post('/:withdrawalId/complete', authenticate, authorize(['admin']), withdrawalController.completeWithdrawal);
router.get('/stats', authenticate, authorize(['admin']), withdrawalController.getWithdrawalStats);

export default router; 