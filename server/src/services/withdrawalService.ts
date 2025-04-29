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
    paymentDetails: Record<string, any>
  ): Promise<ICommissionWithdrawal> {
    const withdrawal = new CommissionWithdrawal({
      userId,
      amount,
      status: 'pending',
      paymentMethod,
      paymentDetails
    });

    const savedWithdrawal = await withdrawal.save();
    return savedWithdrawal.toObject() as ICommissionWithdrawal;
  }

  async processWithdrawal(
    withdrawalId: Types.ObjectId,
    status: 'approved' | 'rejected',
    adminComment?: string
  ): Promise<ICommissionWithdrawal> {
    const withdrawal = await CommissionWithdrawal.findById(withdrawalId);
    if (!withdrawal) {
      throw new Error('Withdrawal not found');
    }

    withdrawal.status = status;
    if (adminComment) {
      withdrawal.adminComment = adminComment;
    }

    const updatedWithdrawal = await withdrawal.save();
    return updatedWithdrawal.toObject() as ICommissionWithdrawal;
  }

  async completeWithdrawal(withdrawalId: Types.ObjectId): Promise<ICommissionWithdrawal> {
    const withdrawal = await CommissionWithdrawal.findById(withdrawalId);
    if (!withdrawal) {
      throw new Error('Withdrawal not found');
    }

    withdrawal.status = 'completed';
    const updatedWithdrawal = await withdrawal.save();
    return updatedWithdrawal.toObject() as ICommissionWithdrawal;
  }

  async getWithdrawalHistory(userId: Types.ObjectId): Promise<ICommissionWithdrawal[]> {
    const withdrawals = await CommissionWithdrawal.find({ userId })
      .sort({ createdAt: -1 });
    return withdrawals.map(withdrawal => withdrawal.toObject() as ICommissionWithdrawal);
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
    const withdrawals = await CommissionWithdrawal.find({ status: 'pending' })
      .sort({ createdAt: -1 });
    return withdrawals.map(withdrawal => withdrawal.toObject() as ICommissionWithdrawal);
  }

  async getWithdrawals(userId: Types.ObjectId): Promise<ICommissionWithdrawal[]> {
    const withdrawals = await CommissionWithdrawal.find({ userId })
      .sort({ createdAt: -1 });
    return withdrawals.map(withdrawal => withdrawal.toObject() as ICommissionWithdrawal);
  }

  async updateWithdrawalStatus(
    withdrawalId: Types.ObjectId,
    status: 'pending' | 'approved' | 'rejected' | 'completed',
    adminComment?: string
  ): Promise<ICommissionWithdrawal> {
    const withdrawal = await CommissionWithdrawal.findById(withdrawalId);
    if (!withdrawal) {
      throw new Error('Withdrawal not found');
    }

    withdrawal.status = status;
    if (adminComment) {
      withdrawal.adminComment = adminComment;
    }

    const updatedWithdrawal = await withdrawal.save();
    return updatedWithdrawal.toObject() as ICommissionWithdrawal;
  }
} 