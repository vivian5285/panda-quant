import express, { Response } from 'express';
import { authenticateToken } from '../middlewares/auth';
import {
  getAssetSummary,
  getChainAddresses,
  createDeposit,
  confirmDeposit,
  updateUserProfit
} from '../controllers/asset.controller';
import { User } from '../models/user.model';
import { Transaction } from '../models/transaction.model';
import { Strategy } from '../models/strategy.model';
import mongoose from 'mongoose';
import { AuthRequest } from '../types/auth';

const router = express.Router();

// 获取资产概览
router.get('/summary', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    await getAssetSummary(req, res);
  } catch (error) {
    console.error('Error in asset summary route:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// 获取链地址
router.get('/chain-addresses', authenticateToken, getChainAddresses);

// 创建充值记录
router.post('/deposit', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    await createDeposit(req, res);
  } catch (error) {
    console.error('Error in create deposit route:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// 确认充值
router.post('/deposit/:paymentId/confirm', authenticateToken, confirmDeposit);

// 更新用户收益
router.post('/profit/:userId', authenticateToken, updateUserProfit);

// Get asset overview
router.get('/overview', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: '未授权' });
    }
    
    // Get user's assets
    const user = await User.findById(new mongoose.Types.ObjectId(userId));
    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }

    // Get active strategies
    const activeStrategies = await Strategy.find({ 
      userId: new mongoose.Types.ObjectId(userId), 
      status: 'running' 
    });

    // Get recent transactions
    const recentTransactions = await Transaction.find({ userId: new mongoose.Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .limit(10);

    // Calculate total profit
    const totalProfit = activeStrategies.reduce((sum, strategy) => sum + (strategy.get('profit') || 0), 0);

    const assetOverview = {
      totalBalance: user.balance,
      totalProfit,
      activeStrategies: activeStrategies.length,
      profitRate: user.balance > 0 ? (totalProfit / user.balance) * 100 : 0,
      recentTransactions: recentTransactions.map(tx => ({
        id: tx._id,
        date: tx.createdAt,
        type: tx.type,
        amount: tx.amount,
        status: tx.status,
        description: tx.description
      }))
    };

    return res.json(assetOverview);
  } catch (error) {
    console.error('Error fetching asset overview:', error);
    return res.status(500).json({ message: '获取资产概览失败' });
  }
});

// Get transaction history
router.get('/transactions', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: '未授权' });
    }
    
    const { page = 1, limit = 20 } = req.query;

    const transactions = await Transaction.find({ userId: new mongoose.Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    const total = await Transaction.countDocuments({ userId: new mongoose.Types.ObjectId(userId) });

    return res.json({
      transactions: transactions.map(tx => ({
        id: tx._id,
        date: tx.createdAt,
        type: tx.type,
        amount: tx.amount,
        status: tx.status,
        description: tx.description
      })),
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching transaction history:', error);
    return res.status(500).json({ message: '获取交易历史失败' });
  }
});

export default router; 