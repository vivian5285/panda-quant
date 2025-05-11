import { Types } from 'mongoose';
import { Deposit } from '../models/Deposit.model';
import { User } from '../models/User.model';
import { IDeposit, IDepositDocument, DepositCreateInput } from '../types/Deposit';
import { IUser } from '../types/User';
import { UserLevelService } from './UserLevelService';
import { logger } from '../utils/Logger';
import { AppError } from '../utils/AppError';

export class DepositService {
  private static instance: DepositService;
  private userLevelService: UserLevelService;
  
  private constructor() {
    this.userLevelService = UserLevelService.getInstance();
  }
  
  public static getInstance(): DepositService {
    if (!DepositService.instance) {
      DepositService.instance = new DepositService();
    }
    return DepositService.instance;
  }

  async createDeposit(depositData: DepositCreateInput): Promise<IDeposit> {
    try {
      const deposit = new Deposit(depositData);
      const savedDeposit = await deposit.save();

      // 更新用户等级
      await this.userLevelService.calculateUserLevel(deposit.amount);

      return this.convertToIDeposit(savedDeposit);
    } catch (error) {
      logger.error('Error creating deposit:', error);
      throw error;
    }
  }

  async getDepositsByUserId(userId: string): Promise<IDeposit[]> {
    try {
      const deposits = await Deposit.find({ userId: new Types.ObjectId(userId) });
      return deposits.map(deposit => this.convertToIDeposit(deposit));
    } catch (error) {
      logger.error('Error getting deposits:', error);
      throw error;
    }
  }

  async getTotalDeposits(userId: string): Promise<number> {
    try {
      const deposits = await Deposit.find({ userId: new Types.ObjectId(userId) });
      return deposits.reduce((total: number, deposit: IDepositDocument) => total + deposit.amount, 0);
    } catch (error) {
      logger.error('Error calculating total deposits:', error);
      throw error;
    }
  }

  private convertToIDeposit(deposit: IDepositDocument): IDeposit {
    return {
      _id: deposit._id,
      userId: deposit.userId,
      amount: deposit.amount,
      status: deposit.status,
      createdAt: deposit.createdAt,
      updatedAt: deposit.updatedAt
    };
  }

  async getDepositById(id: string): Promise<IDepositDocument | null> {
    try {
      return await Deposit.findById(id);
    } catch (error) {
      logger.error('Error getting deposit:', error);
      throw new AppError('Failed to get deposit', 500);
    }
  }

  async getDepositsByUser(userId: string): Promise<IDepositDocument[]> {
    try {
      return await Deposit.find({ userId: new Types.ObjectId(userId) });
    } catch (error) {
      logger.error('Error getting user deposits:', error);
      throw new AppError('Failed to get user deposits', 500);
    }
  }

  async updateDepositStatus(id: string, status: 'pending' | 'completed' | 'failed'): Promise<IDepositDocument | null> {
    try {
      const deposit = await Deposit.findByIdAndUpdate(
        id,
        { status, updatedAt: new Date() },
        { new: true }
      );

      if (deposit && status === 'completed') {
        await this.updateUserBalance(deposit);
      }

      return deposit;
    } catch (error) {
      logger.error('Error updating deposit status:', error);
      throw new AppError('Failed to update deposit status', 500);
    }
  }

  private async updateUserBalance(deposit: IDepositDocument): Promise<void> {
    try {
      const user = await User.findById(deposit.userId);
      if (!user) {
        throw new AppError('User not found', 404);
      }

      // 更新用户余额
      user.balance = (user.balance || 0) + deposit.amount;
      await user.save();

      // 更新用户等级
      await this.userLevelService.calculateUserLevel(deposit.amount);
    } catch (error) {
      logger.error('Error updating user balance:', error);
      throw new AppError('Failed to update user balance', 500);
    }
  }

  async getDepositsByStatus(status: 'pending' | 'completed' | 'failed'): Promise<IDepositDocument[]> {
    try {
      return await Deposit.find({ status });
    } catch (error) {
      logger.error('Error getting deposits by status:', error);
      throw new AppError('Failed to get deposits by status', 500);
    }
  }
} 