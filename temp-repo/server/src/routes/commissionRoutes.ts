import { Router } from 'express';
import { CommissionController } from '../controllers/commissionController';
import { authMiddleware } from '../middleware/auth';

const router = Router();
const commissionController = new CommissionController();

// 用户路由
router.get('/user/commissions', authMiddleware, commissionController.getUserCommissions.bind(commissionController));
router.get('/user/stats', authMiddleware, commissionController.getUserCommissionStats.bind(commissionController));

// 管理员路由
router.get('/admin/commissions', authMiddleware, commissionController.getAllCommissions.bind(commissionController));
router.get('/admin/stats', authMiddleware, commissionController.getCommissionStats.bind(commissionController));
router.get('/admin/distribution', authMiddleware, commissionController.getCommissionDistribution.bind(commissionController));
router.get('/admin/ranking', authMiddleware, commissionController.getCommissionRanking.bind(commissionController));
router.patch('/admin/commissions/:id/status', authMiddleware, commissionController.updateCommissionStatus.bind(commissionController));

export default router; 