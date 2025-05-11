import { Types } from 'mongoose';
import { Withdrawal } from '../models/Withdrawal.model';
import { IWithdrawal, IWithdrawalDocument } from '../types/Withdrawal';
import { logger } from '../utils/Logger';

export class WithdrawalService {
  private static instance: WithdrawalService;

  private constructor() {}

  public static getInstance(): WithdrawalService {
    if (!WithdrawalService.instance) {
      WithdrawalService.instance = new WithdrawalService();
    }
    return WithdrawalService.instance;
  }

  private convertToIWithdrawal(withdrawal: IWithdrawalDocument): IWithdrawal {
    const withdrawalObject = withdrawal.toObject();
    return {
      ...withdrawalObject,
      _id: withdrawalObject._id.toString(),
      userId: withdrawalObject.userId.toString(),
      status: withdrawalObject.status as 'pending' | 'completed' | 'failed'
    } as IWithdrawal;
  }

  async createWithdrawal(withdrawalData: Partial<IWithdrawal>): Promise<IWithdrawal> {
    try {
      const withdrawal = new Withdrawal(withdrawalData);
      const savedWithdrawal = await withdrawal.save();
      return this.convertToIWithdrawal(savedWithdrawal);
    } catch (error) {
      logger.error('Error creating withdrawal:', error);
      throw error;
    }
  }

  async getWithdrawalById(id: string): Promise<IWithdrawal | null> {
    try {
      const withdrawal = await Withdrawal.findById(id);
      return withdrawal ? this.convertToIWithdrawal(withdrawal) : null;
    } catch (error) {
      logger.error('Error getting withdrawal:', error);
      throw error;
    }
  }

  async getWithdrawalByUserId(userId: string): Promise<IWithdrawal | null> {
    try {
      const withdrawal = await Withdrawal.findOne({ userId });
      return withdrawal ? this.convertToIWithdrawal(withdrawal) : null;
    } catch (error) {
      logger.error('Error getting withdrawal by user id:', error);
      throw error;
    }
  }

  async getWithdrawalsByUserId(userId: string): Promise<IWithdrawal[]> {
    try {
      const withdrawals = await Withdrawal.find({ userId });
      return withdrawals.map(withdrawal => this.convertToIWithdrawal(withdrawal));
    } catch (error) {
      logger.error('Error getting withdrawals by user id:', error);
      throw error;
    }
  }

  async updateWithdrawal(id: string, data: Partial<IWithdrawal>): Promise<IWithdrawal | null> {
    try {
      const withdrawal = await Withdrawal.findByIdAndUpdate(id, data, { new: true });
      return withdrawal ? this.convertToIWithdrawal(withdrawal) : null;
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