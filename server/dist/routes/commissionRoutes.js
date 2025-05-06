import { Router } from 'express';
import { CommissionController } from '../controllers/commissionController';
import { authMiddleware } from '../middleware/authMiddleware';
import { ensureAuthenticated } from '../middleware/ensureAuthenticated';
const router = Router();
const commissionController = new CommissionController();
// 所有路由都需要认证
router.use(authMiddleware);
// 获取所有用户的佣金
router.get('/all', async (req, res, next) => {
    try {
        await commissionController.getCommissionByUserId(req, res);
    }
    catch (error) {
        next(error);
    }
});
// 获取当前用户的佣金
router.get('/my', async (req, res, next) => {
    try {
        await commissionController.getCommissionByUserId(req, res);
    }
    catch (error) {
        next(error);
    }
});
const handleRequest = (handler) => {
    return async (req, res, next) => {
        try {
            await handler(req, res);
        }
        catch (error) {
            next(error);
        }
    };
};
// 获取佣金列表
router.get('/', ensureAuthenticated, handleRequest((req, res) => commissionController.getCommissionById(req, res)));
// 获取佣金记录
router.get('/:id', ensureAuthenticated, handleRequest((req, res) => commissionController.getCommissionById(req, res)));
// 创建佣金记录
router.post('/', ensureAuthenticated, handleRequest((req, res) => commissionController.createCommission(req, res)));
// 更新佣金记录
router.put('/:id', ensureAuthenticated, handleRequest((req, res) => commissionController.updateCommission(req, res)));
// 删除佣金记录
router.delete('/:id', ensureAuthenticated, handleRequest((req, res) => commissionController.deleteCommission(req, res)));
// 获取佣金规则
router.get('/rules', ensureAuthenticated, handleRequest((req, res) => commissionController.getCommissionRules(req, res)));
// 创建佣金规则
router.post('/rules', ensureAuthenticated, handleRequest((req, res) => commissionController.createCommissionRule(req, res)));
// 更新佣金规则
router.put('/rules/:id', ensureAuthenticated, handleRequest((req, res) => commissionController.updateCommissionRule(req, res)));
// 删除佣金规则
router.delete('/rules/:id', ensureAuthenticated, handleRequest((req, res) => commissionController.deleteCommissionRule(req, res)));
// 按类型获取佣金
router.get('/type/:type', ensureAuthenticated, handleRequest((req, res) => commissionController.getCommissionsByType(req, res)));
// 按状态、类型和金额获取佣金
router.get('/filter/status-type-amount', ensureAuthenticated, handleRequest((req, res) => commissionController.getCommissionsByStatusAndTypeAndAmount(req, res)));
// 按状态、类型、金额和货币获取佣金
router.get('/filter/status-type-amount-currency', ensureAuthenticated, handleRequest((req, res) => commissionController.getCommissionsByStatusAndTypeAndAmountAndCurrency(req, res)));
// 按用户、状态、类型、金额和货币获取佣金
router.get('/filter/user-status-type-amount-currency', ensureAuthenticated, handleRequest((req, res) => commissionController.getCommissionsByUserAndStatusAndTypeAndAmountAndCurrency(req, res)));
// 按状态、类型、金额、货币和描述获取佣金
router.get('/filter/status-type-amount-currency-description', ensureAuthenticated, handleRequest((req, res) => commissionController.getCommissionsByStatusAndTypeAndAmountAndCurrencyAndDescription(req, res)));
export default router;
//# sourceMappingURL=commissionRoutes.js.map