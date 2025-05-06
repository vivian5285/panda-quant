import express, { Request, Response, NextFunction } from 'express';
import { authenticateToken } from '../middleware/auth';
import { getUserProfitData } from '../controllers/profitController';
import { Strategy } from '../strategies/types';
import { StrategyManager } from '../managers/strategyManager';
import { User } from '../models/user.model';
import mongoose from 'mongoose';
import { Strategy as StrategyModel } from '../models/strategy.model';
import { AuthRequest } from '../types/auth';

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

const router = express.Router();

// 获取所有策略
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const strategyManager = req.app.get('strategyManager') as StrategyManager;
    const strategies = strategyManager.getAllStrategies();
    const strategyList = Array.from(strategies.values()).map((strategy: Strategy) => strategy.getStats());

    res.json({
      success: true,
      data: strategyList
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
router.get('/user', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const strategyManager = req.app.get('strategyManager') as StrategyManager;
    const strategies = strategyManager.getAllStrategies();
    const strategyList = Array.from(strategies.values()).map((strategy: Strategy) => strategy.getStats());

    res.json({
      success: true,
      data: strategyList
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
router.get('/risk/:level', async (req: AuthRequest, res: Response) => {
  try {
    const { level } = req.params;
    const strategyManager = req.app.get('strategyManager') as StrategyManager;
    const strategies = strategyManager.getAllStrategies();
    const strategyList = Array.from(strategies.values())
      .filter((strategy: Strategy) => strategy.riskLevel === level)
      .map((strategy: Strategy) => strategy.getStats());

    res.json({
      success: true,
      data: strategyList
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
router.post('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { preset } = req.body;
    if (!preset) {
      return res.status(400).json({
        success: false,
        message: '缺少策略预设参数'
      });
    }
    const strategyManager = req.app.get('strategyManager') as StrategyManager;
    const strategyId = strategyManager.createStrategy(preset);
    res.json({ success: true, strategyId });
  } catch (error) {
    console.error('Error creating strategy:', error);
    res.status(500).json({ 
      success: false, 
      message: '创建策略失败',
      error: error instanceof Error ? error.message : '未知错误'
    });
  }
});

// 获取策略详情
router.get('/:strategyId', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { strategyId } = req.params;
    const strategyManager = req.app.get('strategyManager') as StrategyManager;
    const strategy = strategyManager.getStrategy(strategyId);
    res.json({ success: true, data: strategy.getStats() });
  } catch (error) {
    console.error('Error getting strategy:', error);
    res.status(500).json({ 
      success: false, 
      message: '获取策略详情失败',
      error: error instanceof Error ? error.message : '未知错误'
    });
  }
});

// 删除策略
router.delete('/:strategyId', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { strategyId } = req.params;
    const strategyManager = req.app.get('strategyManager') as StrategyManager;
    strategyManager.removeStrategy(strategyId);
    res.json({ success: true });
  } catch (error) {
    console.error('Error removing strategy:', error);
    res.status(500).json({ 
      success: false, 
      message: '删除策略失败',
      error: error instanceof Error ? error.message : '未知错误'
    });
  }
});

// 更新策略参数
router.put('/:strategyId/params', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { strategyId } = req.params;
    const { params } = req.body;
    if (!params) {
      return res.status(400).json({
        success: false,
        message: '缺少策略参数'
      });
    }
    const strategyManager = req.app.get('strategyManager') as StrategyManager;
    const strategy = strategyManager.getStrategy(strategyId);
    strategy.updateParams(params);
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating strategy params:', error);
    res.status(500).json({ 
      success: false, 
      message: '更新策略参数失败',
      error: error instanceof Error ? error.message : '未知错误'
    });
  }
});

// 获取策略统计数据
router.get('/:strategyId/stats', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { strategyId } = req.params;
    const strategyManager = req.app.get('strategyManager') as StrategyManager;
    const strategy = strategyManager.getStrategy(strategyId);
    const stats = strategy.getStats();
    res.json({ success: true, data: stats });
  } catch (error) {
    console.error('Error getting strategy stats:', error);
    res.status(500).json({ 
      success: false, 
      message: '获取策略统计数据失败',
      error: error instanceof Error ? error.message : '未知错误'
    });
  }
});

// 获取用户收益数据
router.get('/user/profits', authenticateToken, getUserProfitData);

// Get strategy list
router.get('/list', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: '未授权' });
    }

    const { page = 1, limit = 20 } = req.query;

    const strategies = await StrategyModel.find({ userId: new mongoose.Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    const total = await StrategyModel.countDocuments({ userId: new mongoose.Types.ObjectId(userId) });

    res.json({
      strategies: strategies.map(strategy => ({
        id: strategy._id,
        name: strategy.name,
        type: strategy.type,
        status: strategy.status,
        profit: strategy.profit,
        createdAt: strategy.createdAt,
        updatedAt: strategy.updatedAt
      })),
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching strategy list:', error);
    res.status(500).json({ message: '获取策略列表失败' });
  }
});

export default router; 