import { Router, Request, Response, NextFunction } from 'express';
import { strategyController } from '../controllers/StrategyController';
import { AuthenticatedRequest } from '../types/auth';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

// 所有路由都需要认证
router.use(authenticateToken);

// 获取策略列表
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await strategyController.getAllStrategies(req as AuthenticatedRequest, res);
  } catch (error) {
    next(error);
  }
});

// 创建策略
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await strategyController.createStrategy(req as AuthenticatedRequest, res);
  } catch (error) {
    next(error);
  }
});

// 获取单个策略
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await strategyController.getStrategyById(req as AuthenticatedRequest, res);
  } catch (error) {
    next(error);
  }
});

// 更新策略
router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await strategyController.updateStrategy(req as AuthenticatedRequest, res);
  } catch (error) {
    next(error);
  }
});

// 删除策略
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await strategyController.deleteStrategy(req as AuthenticatedRequest, res);
  } catch (error) {
    next(error);
  }
});

export default router; 