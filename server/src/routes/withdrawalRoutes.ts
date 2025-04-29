import { Router } from 'express';
import { withdrawalController } from '../controllers/withdrawalController';
import { auth } from '../middleware/auth';

const router = Router();

// User routes
router.post('/', auth, withdrawalController.createWithdrawal);
router.get('/', auth, withdrawalController.getWithdrawals);
router.patch('/:id/status', auth, withdrawalController.updateWithdrawalStatus);

// Admin routes
router.get('/pending', auth, withdrawalController.getPendingWithdrawals);
router.post('/:withdrawalId/process', auth, withdrawalController.processWithdrawal);
router.post('/:withdrawalId/complete', auth, withdrawalController.completeWithdrawal);
router.get('/stats', auth, withdrawalController.getWithdrawalStats);

export default router; 