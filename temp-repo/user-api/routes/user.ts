import { Router, Request, Response, NextFunction } from 'express';
import { User } from '../models/user.model';
import { authenticateToken } from '../middlewares/auth';
import { Transaction } from '../models/transaction.model';
import { HostingFee } from '../models/hostingFee.model';
import { Commission } from '../models/commission.model';
import mongoose from 'mongoose';

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

const router = Router();

// Get user info
router.get('/', (req: AuthRequest, res: Response, next: NextFunction) => {
  authenticateToken(req, res, next);
}, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: '未授权' });
    }

    const user = await User.findById(new mongoose.Types.ObjectId(userId));
    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
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
router.get('/account-info', (req: AuthRequest, res: Response, next: NextFunction) => {
  authenticateToken(req, res, next);
}, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: '未授权' });
    }
    
    // Get user basic info
    const user = await User.findById(new mongoose.Types.ObjectId(userId));
    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
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

    const accountInfo = {
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
    };

    res.json(accountInfo);
  } catch (error) {
    console.error('Error fetching account info:', error);
    res.status(500).json({ message: '获取账户信息失败' });
  }
});

// Get user profile
router.get('/profile', (req: AuthRequest, res: Response, next: NextFunction) => {
  authenticateToken(req, res, next);
}, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: '未授权' });
    }

    const user = await User.findById(new mongoose.Types.ObjectId(userId));
    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
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
router.put('/profile', (req: AuthRequest, res: Response, next: NextFunction) => {
  authenticateToken(req, res, next);
}, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: '未授权' });
    }

    const { username, email } = req.body;

    const user = await User.findById(new mongoose.Types.ObjectId(userId));
    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
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

export default router; 