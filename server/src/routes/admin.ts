import { Router, Request, Response, NextFunction } from 'express';
import { UserController } from '../controllers/userController';
import strategyController from '../controllers/Strategy';
import { AuthenticatedRequest, AuthRequest } from '../types/Auth';
import { authenticate, isAdmin } from '../middleware/Auth';

const router = Router();
const userController = new UserController();

// 所有路由都需要认证和管理员权限
router.use(authenticate);
router.use(isAdmin);

// 用户管理路由
router.get('/users', async (req: Request, res: Response) => {
  await userController.getAllUsers(req as AuthenticatedRequest, res);
});

router.post('/users', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await userController.register(req as AuthenticatedRequest, res);
  } catch (error) {
    next(error);
  }
});

router.put('/users/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await userController.updateUser(req as AuthenticatedRequest, res);
  } catch (error) {
    next(error);
  }
});

router.delete('/users/:id', async (req: Request, res: Response) => {
  await userController.deleteUser(req as AuthenticatedRequest, res);
});

// 策略管理路由
router.get('/strategies', async (req: AuthRequest, res) => {
  await strategyController.getStrategies(req, res);
});

router.get('/strategies/:id', async (req: AuthRequest, res) => {
  await strategyController.getStrategy(req, res);
});

router.post('/strategies', async (req: Request, res: Response) => {
  await strategyController.createStrategy(req as AuthRequest, res);
});

router.put('/strategies/:id', async (req: AuthRequest, res) => {
  await strategyController.updateStrategy(req, res);
});

router.delete('/strategies/:id', async (req: AuthRequest, res) => {
  await strategyController.deleteStrategy(req, res);
});

export default router; 