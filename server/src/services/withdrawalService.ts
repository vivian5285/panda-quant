import { Types } from 'mongoose';
import { Withdrawal, IWithdrawalDocument } from '../models/Withdrawal';
import { logger } from '../utils/logger';

export class WithdrawalService {
  private static instance: WithdrawalService;

  private constructor() {}

  public static getInstance(): WithdrawalService {
    if (!WithdrawalService.instance) {
      WithdrawalService.instance = new WithdrawalService();
    }
    return WithdrawalService.instance;
  }

  async createWithdrawal(data: {
    userId: Types.ObjectId;
    amount: number;
    walletAddress: string;
    paymentMethod: 'crypto' | 'bank' | 'paypal';
    paymentDetails: Record<string, any>;
    status?: string;
    metadata?: Record<string, any>;
  }): Promise<IWithdrawalDocument> {
    try {
      const withdrawal = new Withdrawal({
        ...data,
        status: data.status || 'pending',
        metadata: data.metadata || {}
      });
      return await withdrawal.save();
    } catch (error) {
      logger.error('Error creating withdrawal:', error);
      throw error;
    }
  }

  async getWithdrawals(userId: Types.ObjectId): Promise<IWithdrawalDocument[]> {
    try {
      return await Withdrawal.find({ userId });
    } catch (error) {
      logger.error('Error getting withdrawals:', error);
      throw error;
    }
  }

  async getWithdrawalById(id: string): Promise<IWithdrawalDocument | null> {
    try {
      return await Withdrawal.findById(id);
    } catch (error) {
      logger.error('Error getting withdrawal:', error);
      throw error;
    }
  }

  async updateWithdrawal(id: string, data: Partial<IWithdrawalDocument>): Promise<IWithdrawalDocument | null> {
    try {
      return await Withdrawal.findByIdAndUpdate(id, data, { new: true });
    } catch (error) {
      logger.error('Error updating withdrawal:', error);
      throw error;
    }
  }

  async deleteWithdrawal(id: string): Promise<boolean> {
    try {
      const result = await Withdrawal.findByIdAndDelete(id);
      return result !== null;
    } catch (error) {
      logger.error('Error deleting withdrawal:', error);
      throw error;
    }
  }
} 