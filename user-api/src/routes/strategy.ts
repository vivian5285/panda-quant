import { Router, Response } from 'express';
import { StrategyController } from '../controllers/strategy.controller';
import { authenticate } from '../middlewares/auth';
import { AuthRequest } from '../types/express.d';

const router = Router();
const strategyController = new StrategyController();

// 所有路由都需要认证
router.use(authenticate);

// 创建策略
router.post('/', (req: AuthRequest, res: Response) => {
  strategyController.createStrategy(req, res);
});

// 获取策略列表
router.get('/', (req: AuthRequest, res: Response) => {
  strategyController.getStrategies(req, res);
});

// 获取单个策略详情
router.get('/:id', (req: AuthRequest, res: Response) => {
  strategyController.getStrategyById(req, res);
});

// 更新策略
router.put('/:id', (req: AuthRequest, res: Response) => {
  strategyController.updateStrategy(req, res);
});

// 删除策略
router.delete('/:id', (req: AuthRequest, res: Response) => {
  strategyController.deleteStrategy(req, res);
});

// 运行策略
router.post('/:id/run', (req: AuthRequest, res: Response) => {
  strategyController.runStrategy(req, res);
});

// 停止策略
router.post('/:id/stop', (req: AuthRequest, res: Response) => {
  strategyController.stopStrategy(req, res);
});

export default router; 