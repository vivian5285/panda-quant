import express from 'express';
import { User } from '../models/user.model';
import { Strategy } from '../models/strategy.model';
import { Transaction } from '../models/transaction.model';
import { Notification } from '../models/notification.model';
import { authenticateToken } from '../middlewares/auth';

const router = express.Router();

// 获取仪表盘数据
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // 获取用户账户信息
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }

    // 获取用户策略
    const strategies = await Strategy.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5);

    // 获取最近交易
    const transactions = await Transaction.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5);

    // 获取系统通知
    const notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      account: {
        balance: user.balance,
        status: user.status,
        referralCode: user.inviteCode
      },
      strategies: strategies.map(strategy => ({
        id: strategy._id,
        name: strategy.name,
        status: strategy.status,
        profit: strategy.profit,
        startTime: strategy.startTime
      })),
      recentTransactions: transactions.map(transaction => ({
        date: transaction.createdAt,
        type: transaction.type,
        amount: transaction.amount,
        status: transaction.status
      })),
      notifications: notifications.map(notification => ({
        id: notification._id,
        type: notification.type,
        message: notification.message,
        timestamp: notification.createdAt
      }))
    });
  } catch (error) {
    console.error('获取仪表盘数据失败:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

export default router; 