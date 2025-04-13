import express, { Request, Response } from 'express';
import { Strategy, IStrategy } from '../models/strategy.model';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { getUserProfitData } from '../controllers/profitController';
import { StrategyPreset } from '../strategy-engine/types';

const router = express.Router();

// 获取所有激活的策略
router.get('/strategies', async (req: Request, res: Response) => {
  try {
    const strategies = await Strategy.findActiveStrategies()
      .select('name description riskLevel expectedReturn active')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: strategies
    });
  } catch (error) {
    console.error('Error fetching strategies:', error);
    res.status(500).json({
      success: false,
      message: '获取策略数据失败'
    });
  }
});

// 获取用户可用的策略
router.get('/user-strategies', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const strategies = await Strategy.findActiveStrategies()
      .select('name description riskLevel expectedReturn active')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: strategies
    });
  } catch (error) {
    console.error('Error fetching user strategies:', error);
    res.status(500).json({
      success: false,
      message: '获取用户策略数据失败'
    });
  }
});

// 按风险等级获取策略
router.get('/strategies/risk/:level', async (req: Request, res: Response) => {
  try {
    const { level } = req.params;
    const strategies = await Strategy.findByRiskLevel(level)
      .select('name description riskLevel expectedReturn active')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: strategies
    });
  } catch (error) {
    console.error('Error fetching strategies by risk level:', error);
    res.status(500).json({
      success: false,
      message: '获取策略数据失败'
    });
  }
});

// 创建新策略
router.post('/create', async (req, res) => {
  try {
    const { userId, preset } = req.body;
    const strategyManager = req.app.get('strategyManager');
    const strategy = strategyManager.createStrategy(userId, preset);
    res.json({ success: true, strategyId: strategy.id });
  } catch (error) {
    console.error('Error creating strategy:', error);
    res.status(500).json({ success: false, error: 'Failed to create strategy' });
  }
});

// 获取策略列表
router.get('/list/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const strategyManager = req.app.get('strategyManager');
    const strategies = strategyManager.getAllStrategies();
    const userStrategies = Array.from(strategies.values())
      .filter(strategy => strategy.userId === userId);
    res.json({ success: true, strategies: userStrategies });
  } catch (error) {
    console.error('Error getting strategies:', error);
    res.status(500).json({ success: false, error: 'Failed to get strategies' });
  }
});

// 获取策略详情
router.get('/:strategyId', async (req, res) => {
  try {
    const { strategyId } = req.params;
    const strategyManager = req.app.get('strategyManager');
    const strategy = strategyManager.getStrategy(strategyId);
    if (!strategy) {
      return res.status(404).json({ success: false, error: 'Strategy not found' });
    }
    res.json({ success: true, strategy });
  } catch (error) {
    console.error('Error getting strategy:', error);
    res.status(500).json({ success: false, error: 'Failed to get strategy' });
  }
});

// 删除策略
router.delete('/:strategyId', async (req, res) => {
  try {
    const { strategyId } = req.params;
    const strategyManager = req.app.get('strategyManager');
    strategyManager.removeStrategy(strategyId);
    res.json({ success: true });
  } catch (error) {
    console.error('Error removing strategy:', error);
    res.status(500).json({ success: false, error: 'Failed to remove strategy' });
  }
});

// 更新策略参数
router.put('/:strategyId/params', async (req, res) => {
  try {
    const { strategyId } = req.params;
    const { params } = req.body;
    const strategyManager = req.app.get('strategyManager');
    const strategy = strategyManager.getStrategy(strategyId);
    if (!strategy) {
      return res.status(404).json({ success: false, error: 'Strategy not found' });
    }
    strategy.updateParams(params);
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating strategy params:', error);
    res.status(500).json({ success: false, error: 'Failed to update strategy params' });
  }
});

// 获取策略统计数据
router.get('/:strategyId/stats', async (req, res) => {
  try {
    const { strategyId } = req.params;
    const strategyManager = req.app.get('strategyManager');
    const strategy = strategyManager.getStrategy(strategyId);
    if (!strategy) {
      return res.status(404).json({ success: false, error: 'Strategy not found' });
    }
    const stats = strategy.getStats();
    res.json({ success: true, stats });
  } catch (error) {
    console.error('Error getting strategy stats:', error);
    res.status(500).json({ success: false, error: 'Failed to get strategy stats' });
  }
});

// 获取用户收益数据
router.get('/user-profits', authenticateToken, getUserProfitData);

export default router; 