import { Request, Response } from 'express';
import { User } from '../models/user.model';
import Transaction from '../models/transaction.model';

// 获取所有用户
export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find()
      .select('email balance deductionCredit status')
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// 更新用户状态
export const updateUserStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // 验证状态值
    if (!['active', 'insufficient_balance', 'suspended'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error updating user status:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// 发放奖励
export const rewardUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid reward amount' });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // 开始事务
    const session = await User.startSession();
    session.startTransaction();

    try {
      // 更新用户余额
      user.balance += amount;
      await user.save({ session });

      // 创建交易记录
      const transaction = new Transaction({
        userId: user._id,
        type: 'reward',
        amount,
        status: 'completed',
        description: 'Admin reward'
      });
      await transaction.save({ session });

      // 提交事务
      await session.commitTransaction();
      session.endSession();

      res.json({ message: 'Reward successful', user });
    } catch (error) {
      // 回滚事务
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  } catch (error) {
    console.error('Error rewarding user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}; 