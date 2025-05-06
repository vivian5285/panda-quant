import { Router } from 'express';
import { UserController } from '../controllers/userController';
import strategyController from '../controllers/Strategy';
import { authenticate, isAdmin } from '../middleware/Auth';
const router = Router();
const userController = new UserController();
// 所有路由都需要认证和管理员权限
router.use(authenticate);
router.use(isAdmin);
// 用户管理路由
router.get('/users', async (req, res) => {
    await userController.getAllUsers(req, res);
});
router.post('/users', async (req, res, next) => {
    try {
        await userController.register(req, res);
    }
    catch (error) {
        next(error);
    }
});
router.put('/users/:id', async (req, res, next) => {
    try {
        await userController.updateUser(req, res);
    }
    catch (error) {
        next(error);
    }
});
router.delete('/users/:id', async (req, res) => {
    await userController.deleteUser(req, res);
});
// 策略管理路由
router.get('/strategies', async (req, res) => {
    await strategyController.getStrategies(req, res);
});
router.get('/strategies/:id', async (req, res) => {
    await strategyController.getStrategy(req, res);
});
router.post('/strategies', async (req, res) => {
    await strategyController.createStrategy(req, res);
});
router.put('/strategies/:id', async (req, res) => {
    await strategyController.updateStrategy(req, res);
});
router.delete('/strategies/:id', async (req, res) => {
    await strategyController.deleteStrategy(req, res);
});
export default router;
//# sourceMappingURL=admin.js.map