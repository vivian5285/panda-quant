import { Types, Model } from 'mongoose';
import { Withdrawal } from '../models/Withdrawal';
import { WithdrawalStatus } from '../types/enums';
import { IWithdrawal, IWithdrawalDocument } from '../types/withdrawal';
import { logger } from '../utils/logger';

export class WithdrawalService {
  private withdrawalModel: Model<IWithdrawalDocument>;

  constructor() {
    this.withdrawalModel = Withdrawal as Model<IWithdrawalDocument>;
  }

  async createWithdrawal(data: Partial<IWithdrawal>): Promise<IWithdrawalDocument> {
    try {
      const withdrawal = new this.withdrawalModel({
        ...data,
        status: data.status || WithdrawalStatus.PENDING,
        userId: new Types.ObjectId(data.userId)
      });
      return await withdrawal.save();
    } catch (error) {
      logger.error('Error creating withdrawal:', error);
      throw error;
    }
  }

  async getWithdrawals(userId: string): Promise<IWithdrawalDocument[]> {
    try {
      return await this.withdrawalModel.find({ userId: new Types.ObjectId(userId) });
    } catch (error) {
      logger.error('Error getting withdrawals:', error);
      throw error;
    }
  }

  async getWithdrawal(id: string, userId: string): Promise<IWithdrawalDocument | null> {
    try {
      return await this.withdrawalModel.findOne({ 
        _id: new Types.ObjectId(id), 
        userId: new Types.ObjectId(userId) 
      });
    } catch (error) {
      logger.error('Error getting withdrawal:', error);
      throw error;
    }
  }

  async updateWithdrawal(id: string, userId: string, data: Partial<IWithdrawal>): Promise<IWithdrawalDocument | null> {
    try {
      return await this.withdrawalModel.findOneAndUpdate(
        { _id: new Types.ObjectId(id), userId: new Types.ObjectId(userId) },
        { $set: data },
        { new: true }
      );
    } catch (error) {
      logger.error('Error updating withdrawal:', error);
      throw error;
    }
  }

  async deleteWithdrawal(id: string, userId: string): Promise<IWithdrawalDocument | null> {
    try {
      return await this.withdrawalModel.findOneAndDelete({ 
        _id: new Types.ObjectId(id), 
        userId: new Types.ObjectId(userId) 
      });
    } catch (error) {
      logger.error('Error deleting withdrawal:', error);
      throw error;
    }
  }

  async getWithdrawalsByStatus(userId: string, status: WithdrawalStatus): Promise<IWithdrawalDocument[]> {
    try {
      return await this.withdrawalModel.find({ 
        userId: new Types.ObjectId(userId), 
        status 
      });
    } catch (error) {
      logger.error('Error getting withdrawals by status:', error);
      throw error;
    }
  }

  async getWithdrawalsByPaymentMethod(userId: string, paymentMethod: string): Promise<IWithdrawalDocument[]> {
    try {
      return await this.withdrawalModel.find({ 
        userId: new Types.ObjectId(userId), 
        paymentMethod 
      });
    } catch (error) {
      logger.error('Error getting withdrawals by payment method:', error);
      throw error;
    }
  }

  async getWithdrawalStats(userId: string): Promise<{
    totalWithdrawals: number;
    totalAmount: number;
    pendingWithdrawals: number;
  }> {
    try {
      const stats = await this.withdrawalModel.aggregate([
        { $match: { userId: new Types.ObjectId(userId) } },
        {
          $group: {
            _id: null,
            totalWithdrawals: { $sum: 1 },
            totalAmount: { $sum: '$amount' },
            pendingWithdrawals: {
              $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
            }
          }
        }
      ]);

      return stats[0] || {
        totalWithdrawals: 0,
        totalAmount: 0,
        pendingWithdrawals: 0
      };
    } catch (error) {
      logger.error('Error getting withdrawal stats:', error);
      throw error;
    }
  }

  async cancelWithdrawal(data: { _id: Types.ObjectId; status: string }): Promise<IWithdrawalDocument | null> {
    try {
      return await this.withdrawalModel.findByIdAndUpdate(
        data._id,
        { status: data.status },
        { new: true }
      );
    } catch (error) {
      logger.error('Error cancelling withdrawal:', error);
      throw error;
    }
  }
} 