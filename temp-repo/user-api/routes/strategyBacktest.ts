import express from 'express';
import { BacktestService } from '../services/backtestService';
import { SuperTrendStrategy } from '../../strategy-engine/strategies/superTrendStrategy';
import { StrategyPreset } from '../../strategy-engine/types';

const router = express.Router();

// 运行回测
router.post('/run', async (req, res) => {
  const { strategyName, riskLevel, symbol, timeframe, startDate, endDate, initialCapital } = req.body;
  const userId = req.user.id; // 从认证中间件获取用户ID

  try {
    // 根据策略名称创建策略实例
    let strategy: any;
    switch (strategyName) {
      case 'superTrend':
        strategy = new SuperTrendStrategy(StrategyPreset[riskLevel]);
        break;
      // 可以添加其他策略
      default:
        return res.status(400).json({ error: 'Invalid strategy name' });
    }

    // 运行回测
    const backtestResults = await BacktestService.runBacktest(
      userId,
      strategy,
      symbol,
      timeframe,
      new Date(startDate),
      new Date(endDate),
      initialCapital
    );

    res.json(backtestResults);
  } catch (error) {
    console.error('Error running backtest:', error);
    res.status(500).json({ error: 'Error running backtest' });
  }
});

// 获取回测历史
router.get('/history', async (req, res) => {
  const userId = req.user.id;

  try {
    const history = await BacktestService.getUserBacktestHistory(userId);
    res.json(history);
  } catch (error) {
    console.error('Error fetching backtest history:', error);
    res.status(500).json({ error: 'Error fetching backtest history' });
  }
});

// 获取回测详情
router.get('/details/:id', async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const details = await BacktestService.getBacktestDetails(parseInt(id));
    // 验证用户权限
    if (details.user_id !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    res.json(details);
  } catch (error) {
    console.error('Error fetching backtest details:', error);
    res.status(500).json({ error: 'Error fetching backtest details' });
  }
});

export default router; 