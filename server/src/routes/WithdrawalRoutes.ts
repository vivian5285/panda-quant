import express, { Router } from 'express';
import { Response } from 'express';
import { handleRequest } from '../utils/RequestHandler';
import { ensureAuthenticated } from '../middleware/EnsureAuthenticated';
import { adminMiddleware } from '../middleware/AdminMiddleware';
import { AuthenticatedRequest } from '../types/Auth';
import { WithdrawalController } from '../controllers/WithdrawalController';

const router: Router = express.Router();
const withdrawalController = new WithdrawalController();

// Admin routes
router.get('/admin/withdrawals', ensureAuthenticated, adminMiddleware, handleRequest(async (req: AuthenticatedRequest, res: Response) => {
  await withdrawalController.getWithdrawals(req, res);
}));

router.get('/admin/withdrawals/stats', ensureAuthenticated, adminMiddleware, handleRequest(async (req: AuthenticatedRequest, res: Response) => {
  await withdrawalController.getWithdrawals(req, res);
}));

router.put('/admin/withdrawals/:id', ensureAuthenticated, adminMiddleware, handleRequest(async (req: AuthenticatedRequest, res: Response) => {
  await withdrawalController.updateWithdrawal(req, res);
}));

// User routes
router.get('/', ensureAuthenticated, handleRequest(async (req: AuthenticatedRequest, res: Response) => {
  await withdrawalController.getWithdrawals(req, res);
}));

router.post('/', ensureAuthenticated, handleRequest(async (req: AuthenticatedRequest, res: Response) => {
  await withdrawalController.createWithdrawal(req, res);
}));

router.get('/:id', ensureAuthenticated, handleRequest(async (req: AuthenticatedRequest, res: Response) => {
  await withdrawalController.getWithdrawalById(req, res);
}));

router.put('/:id', ensureAuthenticated, handleRequest(async (req: AuthenticatedRequest, res: Response) => {
  await withdrawalController.updateWithdrawal(req, res);
}));

router.delete('/:id', ensureAuthenticated, handleRequest(async (req: AuthenticatedRequest, res: Response) => {
  await withdrawalController.deleteWithdrawal(req, res);
}));

export default router; 