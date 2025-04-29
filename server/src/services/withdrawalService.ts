import { CommissionWithdrawal } from '../models/commissionWithdrawal';
import { ICommissionWithdrawal } from '../interfaces/ICommissionWithdrawal';
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
  ): Promise<ICommissionWithdrawal> {
    const withdrawal = new CommissionWithdrawal({
      userId,
      amount,
      status: 'pending',
      paymentMethod,
      paymentDetails
    });
    return await withdrawal.save();
  }

  async processWithdrawal(
    withdrawalId: Types.ObjectId,
    status: 'approved' | 'rejected',
    adminComment?: string
  ): Promise<ICommissionWithdrawal> {
    const withdrawal = await CommissionWithdrawal.findByIdAndUpdate(
      withdrawalId,
      { status, adminComment },
      { new: true }
    );
    if (!withdrawal) {
      throw new Error('Withdrawal not found');
    }
    return withdrawal;
  }

  async completeWithdrawal(withdrawalId: Types.ObjectId): Promise<ICommissionWithdrawal> {
    const withdrawal = await CommissionWithdrawal.findByIdAndUpdate(
      withdrawalId,
      { status: 'completed' },
      { new: true }
    );
    if (!withdrawal) {
      throw new Error('Withdrawal not found');
    }
    return withdrawal;
  }

  async getWithdrawalHistory(userId: Types.ObjectId): Promise<ICommissionWithdrawal[]> {
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

  async getPendingWithdrawals(): Promise<ICommissionWithdrawal[]> {
    return await CommissionWithdrawal.find({ status: 'pending' }).sort({ createdAt: -1 });
  }

  async getWithdrawals(userId: Types.ObjectId): Promise<ICommissionWithdrawal[]> {
    return await CommissionWithdrawal.find({ userId }).sort({ createdAt: -1 });
  }

  async updateWithdrawalStatus(
    withdrawalId: Types.ObjectId,
    status: 'pending' | 'approved' | 'rejected' | 'completed',
    adminComment?: string
  ): Promise<ICommissionWithdrawal> {
    const withdrawal = await CommissionWithdrawal.findByIdAndUpdate(
      withdrawalId,
      { status, adminComment },
      { new: true }
    );
    if (!withdrawal) {
      throw new Error('Withdrawal not found');
    }
    return withdrawal;
  }
} 