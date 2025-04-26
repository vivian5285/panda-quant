import { Router } from 'express';
import { StrategyController } from '../controllers/strategy.controller';

const router = Router();
const strategyController = new StrategyController();

// 创建策略
router.post('/', strategyController.createStrategy.bind(strategyController));

// 获取策略列表
router.get('/', strategyController.getStrategies.bind(strategyController));

// 获取单个策略详情
router.get('/:id', strategyController.getStrategyById.bind(strategyController));

// 更新策略
router.put('/:id', strategyController.updateStrategy.bind(strategyController));

// 删除策略
router.delete('/:id', strategyController.deleteStrategy.bind(strategyController));

// 运行策略
router.post('/:id/run', strategyController.runStrategy.bind(strategyController));

// 停止策略
router.post('/:id/stop', strategyController.stopStrategy.bind(strategyController));

export default router; 