import { Router, Response } from 'express';
import { StrategyController } from '../controllers/strategy.controller';
import { authenticate } from '../middlewares/auth';
import { AuthRequest } from '../types/express.d';

const router = Router();
const strategyController = new StrategyController();

// 所有路由都需要认证
router.use(authenticate);

// 创建策略
router.post('/', async (req: AuthRequest, res: Response) => {
  await strategyController.createStrategy(req, res);
});

// 获取策略列表
router.get('/', async (req: AuthRequest, res: Response) => {
  await strategyController.getStrategies(req, res);
});

// 获取单个策略详情
router.get('/:id', async (req: AuthRequest, res: Response) => {
  await strategyController.getStrategyById(req, res);
});

// 更新策略
router.put('/:id', async (req: AuthRequest, res: Response) => {
  await strategyController.updateStrategy(req, res);
});

// 删除策略
router.delete('/:id', async (req: AuthRequest, res: Response) => {
  await strategyController.deleteStrategy(req, res);
});

// 运行策略
router.post('/:id/run', async (req: AuthRequest, res: Response) => {
  await strategyController.runStrategy(req, res);
});

// 停止策略
router.post('/:id/stop', async (req: AuthRequest, res: Response) => {
  await strategyController.stopStrategy(req, res);
});

export default router; 