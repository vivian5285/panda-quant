import { Router, Response } from 'express';
import { User } from '../models/user.model';
import { authenticateToken } from '../middlewares/auth';
import { Transaction } from '../models/transaction.model';
import { HostingFee } from '../models/hostingFee.model';
import { Commission } from '../models/commission.model';
import mongoose from 'mongoose';
import { AuthRequest } from '../types/auth';

const router = Router();

// Get user info
router.get('/', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: '未授权' });
      return;
    }

    const user = await User.findById(new mongoose.Types.ObjectId(userId));
    if (!user) {
      res.status(404).json({ message: '用户不存在' });
      return;
    }

    res.json({
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      status: user.status
    });
  } catch (error) {
    console.error('Error fetching user info:', error);
    res.status(500).json({ message: '获取用户信息失败' });
  }
});

// Get user account information
router.get('/account-info', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: '未授权' });
      return;
    }

    const user = await User.findById(new mongoose.Types.ObjectId(userId));
    if (!user) {
      res.status(404).json({ message: '用户不存在' });
      return;
    }

    // Get balance history
    const balanceHistory = await Transaction.find({ userId: new mongoose.Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .limit(10);

    // Get hosting fee history
    const hostingFeeHistory = await HostingFee.find({ userId: new mongoose.Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .limit(10);

    // Get commission history
    const commissionHistory = await Commission.find({ userId: new mongoose.Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      balance: user.balance,
      hostingFee: user.hostingFee,
      status: user.status,
      referralCode: user.referralCode,
      referralRewards: user.referralRewards,
      balanceHistory: balanceHistory.map(record => ({
        date: record.createdAt,
        amount: record.amount,
        type: record.type,
        description: record.description
      })),
      hostingFeeHistory: hostingFeeHistory.map(record => ({
        date: record.createdAt,
        amount: record.amount,
        status: record.status
      })),
      commissionHistory: commissionHistory.map(record => ({
        date: record.createdAt,
        amount: record.amount,
        type: record.type,
        fromUser: record.fromUser
      }))
    });
  } catch (error) {
    console.error('Error fetching account info:', error);
    res.status(500).json({ message: '获取账户信息失败' });
  }
});

// Get user profile
router.get('/profile', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: '未授权' });
      return;
    }

    const user = await User.findById(new mongoose.Types.ObjectId(userId));
    if (!user) {
      res.status(404).json({ message: '用户不存在' });
      return;
    }

    res.json({
      id: user._id,
      email: user.email,
      name: user.name,
      inviteCode: user.inviteCode,
      role: user.role
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: '获取个人信息失败' });
  }
});

// Update user profile
router.put('/profile', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: '未授权' });
      return;
    }

    const { username, email } = req.body;

    const user = await User.findById(new mongoose.Types.ObjectId(userId));
    if (!user) {
      res.status(404).json({ message: '用户不存在' });
      return;
    }

    if (username) user.username = username;
    if (email) user.email = email;

    await user.save();

    res.json({ message: '个人信息更新成功' });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: '更新个人信息失败' });
  }
});

export const userRouter = router; 