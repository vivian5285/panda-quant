import { Router } from 'express';
import {
  getAvailableStrategies,
  createStrategy,
  analyzeMarket,
  executeTrade,
  getStrategyStats
} from '../controllers/strategy.controller';

const router = Router();

// 获取可用策略
router.get('/available', getAvailableStrategies);

// 创建策略
router.post('/', createStrategy);

// 分析市场
router.post('/:strategyId/analyze', analyzeMarket);

// 执行交易
router.post('/:strategyId/trade', executeTrade);

// 获取策略统计
router.get('/:strategyId/stats', getStrategyStats);

export default router; 