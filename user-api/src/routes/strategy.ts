import { Router } from 'express';
import { StrategyController } from '../controllers/strategy.controller';
import { authenticate } from '../middlewares/auth';

const router = Router();
const strategyController = new StrategyController();

// 所有路由都需要认证
router.use(authenticate);

// 创建策略
router.post('/', (req, res) => strategyController.createStrategy(req, res));

// 获取策略列表
router.get('/', (req, res) => strategyController.getStrategies(req, res));

// 获取单个策略详情
router.get('/:id', (req, res) => strategyController.getStrategyById(req, res));

// 更新策略
router.put('/:id', (req, res) => strategyController.updateStrategy(req, res));

// 删除策略
router.delete('/:id', (req, res) => strategyController.deleteStrategy(req, res));

// 运行策略
router.post('/:id/run', (req, res) => strategyController.runStrategy(req, res));

// 停止策略
router.post('/:id/stop', (req, res) => strategyController.stopStrategy(req, res));

export default router; 