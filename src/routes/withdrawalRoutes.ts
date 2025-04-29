import { Router } from 'express';
import { WithdrawalController } from '../controllers/withdrawalController';
import { authMiddleware } from '../middleware/auth';

const router = Router();
const withdrawalController = new WithdrawalController();

router.post('/', authMiddleware, (req, res) => withdrawalController.createWithdrawal(req, res));
router.get('/:id', authMiddleware, (req, res) => withdrawalController.getWithdrawalById(req, res));
router.get('/user/me', authMiddleware, (req, res) => withdrawalController.getWithdrawalsByUserId(req, res));
router.put('/:id/status', authMiddleware, (req, res) => withdrawalController.updateWithdrawalStatus(req, res));
router.delete('/:id', authMiddleware, (req, res) => withdrawalController.deleteWithdrawal(req, res));

export default router; 