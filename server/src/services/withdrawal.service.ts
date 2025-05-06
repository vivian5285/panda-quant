import { Types } from 'mongoose';
import { Withdrawal } from '../models/Withdrawal';
import { IWithdrawal, IWithdrawalDocument } from '../types/Withdrawal';
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

  async createWithdrawal(data: Omit<IWithdrawal, '_id' | 'createdAt' | 'updatedAt'>): Promise<IWithdrawal> {
    try {
      const withdrawal = new Withdrawal(data);
      const savedWithdrawal = await withdrawal.save();
      return savedWithdrawal.toObject();
    } catch (error) {
      logger.error('Error creating withdrawal:', error);
      throw error;
    }
  }

  async getWithdrawalById(id: string): Promise<IWithdrawal | null> {
    try {
      const withdrawal = await Withdrawal.findById(id);
      return withdrawal ? withdrawal.toObject() : null;
    } catch (error) {
      logger.error('Error getting withdrawal:', error);
      throw error;
    }
  }

  async updateWithdrawal(id: string, data: Partial<IWithdrawal>): Promise<IWithdrawal | null> {
    try {
      const withdrawal = await Withdrawal.findByIdAndUpdate(id, data, { new: true });
      return withdrawal ? withdrawal.toObject() : null;
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

  async getWithdrawalsByUserId(userId: string): Promise<IWithdrawal[]> {
    try {
      const withdrawals = await Withdrawal.find({ userId });
      return withdrawals.map(withdrawal => withdrawal.toObject());
    } catch (error) {
      logger.error('Error getting withdrawals by user:', error);
      throw error;
    }
  }
} 