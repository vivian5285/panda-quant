import { Router } from 'express';
import { WithdrawalController } from '../controllers/withdrawalController';
import { authenticate, isAdmin } from '../middleware/Auth';
import { authMiddleware } from '../middleware/authMiddleware';
const router = Router();
const withdrawalController = new WithdrawalController();
// Admin routes
router.get('/admin/withdrawals', authenticate, isAdmin, async (req, res, next) => {
    try {
        await withdrawalController.getWithdrawals(req, res);
    }
    catch (error) {
        next(error);
    }
});
router.get('/admin/withdrawals/stats', authenticate, isAdmin, async (req, res, next) => {
    try {
        await withdrawalController.getWithdrawals(req, res);
    }
    catch (error) {
        next(error);
    }
});
router.put('/admin/withdrawals/:id', authenticate, isAdmin, async (req, res, next) => {
    try {
        await withdrawalController.updateWithdrawal(req, res);
    }
    catch (error) {
        next(error);
    }
});
// User routes
router.get('/', authMiddleware, async (req, res) => {
    await withdrawalController.getWithdrawals(req, res);
});
router.post('/', authMiddleware, async (req, res) => {
    await withdrawalController.createWithdrawal(req, res);
});
router.get('/:id', authMiddleware, async (req, res) => {
    await withdrawalController.getWithdrawals(req, res);
});
router.put('/:id/status', authMiddleware, async (req, res) => {
    await withdrawalController.updateWithdrawal(req, res);
});
router.post('/:id/cancel', authMiddleware, async (req, res) => {
    await withdrawalController.createWithdrawal(req, res);
});
export default router;
//# sourceMappingURL=withdrawalRoutes.js.map