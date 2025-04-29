import { CommissionWithdrawal } from '../models/commissionWithdrawal';
import { User } from '../models/User';
import { Types } from 'mongoose';

export class WithdrawalService {
  private static instance: WithdrawalService;

  private constructor() {}

  public static getInstance(): WithdrawalService {
    if (!WithdrawalService.instance) {
      WithdrawalService.instance = new WithdrawalService();
    }
    return WithdrawalService.instance;
  }

  async createWithdrawalRequest(
    userId: Types.ObjectId,
    amount: number,
    paymentMethod: string,
    paymentDetails: any
  ): Promise<CommissionWithdrawal> {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    if (user.commissionBalance < amount) {
      throw new Error('Insufficient commission balance');
    }

    const withdrawal = new CommissionWithdrawal({
      userId,
      amount,
      paymentMethod,
      paymentDetails,
      status: 'pending'
    });

    await withdrawal.save();
    return withdrawal;
  }

  async processWithdrawal(
    withdrawalId: Types.ObjectId,
    status: 'approved' | 'rejected',
    adminComment: string
  ): Promise<CommissionWithdrawal> {
    const withdrawal = await CommissionWithdrawal.findById(withdrawalId);
    if (!withdrawal) {
      throw new Error('Withdrawal not found');
    }

    if (withdrawal.status !== 'pending') {
      throw new Error('Withdrawal is not in pending status');
    }

    const user = await User.findById(withdrawal.userId);
    if (!user) {
      throw new Error('User not found');
    }

    if (status === 'approved') {
      user.commissionBalance -= withdrawal.amount;
      await user.save();
    }

    withdrawal.status = status;
    withdrawal.adminComment = adminComment;
    await withdrawal.save();

    return withdrawal;
  }

  async completeWithdrawal(withdrawalId: Types.ObjectId): Promise<CommissionWithdrawal> {
    const withdrawal = await CommissionWithdrawal.findById(withdrawalId);
    if (!withdrawal) {
      throw new Error('Withdrawal not found');
    }

    if (withdrawal.status !== 'approved') {
      throw new Error('Withdrawal must be approved before completion');
    }

    withdrawal.status = 'completed';
    await withdrawal.save();

    return withdrawal;
  }

  async getWithdrawalHistory(userId: Types.ObjectId): Promise<CommissionWithdrawal[]> {
    return await CommissionWithdrawal.find({ userId }).sort({ createdAt: -1 });
  }

  async getWithdrawalStats(userId: Types.ObjectId): Promise<{
    totalWithdrawn: number;
    pendingWithdrawals: number;
    completedWithdrawals: number;
  }> {
    const [pending, completed] = await Promise.all([
      CommissionWithdrawal.find({ userId, status: 'pending' }),
      CommissionWithdrawal.find({ userId, status: 'completed' })
    ]);

    const totalWithdrawn = completed.reduce((sum, w) => sum + w.amount, 0);

    return {
      totalWithdrawn,
      pendingWithdrawals: pending.length,
      completedWithdrawals: completed.length
    };
  }
} 