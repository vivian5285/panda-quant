import { Router, Request, Response, NextFunction } from 'express';
import { WithdrawalController } from '../controllers/withdrawalController';
import { authenticate, isAdmin } from '../middleware/Auth';
import { AuthenticatedRequest } from '../types/Auth';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();
const withdrawalController = new WithdrawalController();

// Admin routes
router.get('/admin/withdrawals', authenticate, isAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    await withdrawalController.getWithdrawals(req as AuthenticatedRequest, res);
  } catch (error) {
    next(error);
  }
});

router.get('/admin/withdrawals/stats', authenticate, isAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    await withdrawalController.getWithdrawals(req as AuthenticatedRequest, res);
  } catch (error) {
    next(error);
  }
});

router.put('/admin/withdrawals/:id', authenticate, isAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    await withdrawalController.updateWithdrawal(req as AuthenticatedRequest, res);
  } catch (error) {
    next(error);
  }
});

// User routes
router.get('/', authMiddleware, async (req, res) => {
  await withdrawalController.getWithdrawals(req as AuthenticatedRequest, res);
});

router.post('/', authMiddleware, async (req, res) => {
  await withdrawalController.createWithdrawal(req as AuthenticatedRequest, res);
});

router.get('/:id', authMiddleware, async (req, res) => {
  await withdrawalController.getWithdrawals(req as AuthenticatedRequest, res);
});

router.put('/:id/status', authMiddleware, async (req, res) => {
  await withdrawalController.updateWithdrawal(req as AuthenticatedRequest, res);
});

router.post('/:id/cancel', authMiddleware, async (req, res) => {
  await withdrawalController.createWithdrawal(req as AuthenticatedRequest, res);
});

export default router; 