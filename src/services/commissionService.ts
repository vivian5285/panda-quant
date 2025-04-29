import { Model } from 'mongoose';
import { User, ICommission, IUserLevel, ICommissionRecord } from '../types';
import { StrategyPerformance } from '../models/strategyPerformance';
import { Commission } from '../models/commission';
import { IUser } from '../models/user';
import { CommissionRecord } from '../models/commissionRecord';
import { ICommission as ICommissionInterface } from '../interfaces/ICommission';
import { IUser as IUserInterface } from '../interfaces/IUser';

export interface ICommissionService {
  calculateCommission(performance: number, userLevel: IUserLevel): number;
  distributeCommission(strategyId: string, userId: string, performance: number): Promise<void>;
}

export class CommissionService implements ICommissionService {
  private readonly baseCommissionRate = 0.1; // 10% base commission rate
  private commissionModel: typeof Commission;
  private userModel: typeof User;
  private commissionRecordModel: typeof CommissionRecord;
  private strategyPerformanceModel: typeof StrategyPerformance;

  private static instance: CommissionService;

  private constructor() {
    this.commissionModel = Commission;
    this.userModel = User;
    this.commissionRecordModel = CommissionRecord;
    this.strategyPerformanceModel = StrategyPerformance;
  }

  public static getInstance(): CommissionService {
    if (!CommissionService.instance) {
      CommissionService.instance = new CommissionService();
    }
    return CommissionService.instance;
  }

  /**
   * 计算佣金
   * @param performance 策略表现
   * @param userLevel 用户等级
   * @returns 计算出的佣金
   */
  public calculateCommission(performance: number, userLevel: IUserLevel): number {
    const levelMultiplier = this.getLevelMultiplier(userLevel);
    return performance * this.baseCommissionRate * levelMultiplier;
  }

  /**
   * 分配佣金
   * @param strategyId 策略ID
   * @param userId 用户ID
   * @param performance 策略表现
   */
  public async distributeCommission(strategyId: string, userId: string, performance: number): Promise<void> {
    const commissionEarned = this.calculateCommission(performance, 'bronze'); // Default to bronze level
    await this.strategyPerformanceModel.create({
      strategyId,
      userId,
      performance,
      commissionEarned,
      date: new Date()
    });
  }

  /**
   * 获取用户等级对应的佣金倍率
   * @param userLevel 用户等级
   * @returns 佣金倍率
   */
  private getLevelMultiplier(userLevel: IUserLevel): number {
    switch (userLevel) {
      case 'bronze':
        return 1.0;
      case 'silver':
        return 1.2;
      case 'gold':
        return 1.5;
      case 'platinum':
        return 2.0;
      default:
        return 1.0;
    }
  }

  public async createCommissionRecord(data: Partial<ICommissionInterface>): Promise<ICommissionInterface> {
    return await this.commissionModel.create(data);
  }

  public async distributeCommissionRecord(recordId: string): Promise<void> {
    const record = await this.commissionRecordModel.findById(recordId);
    if (!record) {
      throw new Error('Commission record not found');
    }

    const referrer = await this.userModel.findById(record.referrerId);
    if (!referrer) {
      throw new Error('Referrer not found');
    }

    const commission = new this.commissionModel({
      userId: referrer._id,
      amount: record.amount,
      type: 'referral',
      status: 'completed'
    });

    await commission.save();
    record.status = 'completed';
    await record.save();
  }

  public async getCommissionHistory(userId: string): Promise<ICommissionInterface[]> {
    return await this.commissionModel.find({ userId });
  }

  public async getTotalCommission(userId: string): Promise<number> {
    const records = await this.getCommissionHistory(userId);
    const commissions = await this.commissionModel.find({ userId });
    return commissions.reduce((total, commission) => total + commission.amount, 0);
  }

  private async getUserLevel(userId: string): Promise<IUserLevel> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const totalCommission = await this.getTotalCommission(userId);
    const userLevels = await this.getUserLevels();
    
    for (const level of userLevels) {
      if (totalCommission >= level.requirements.commission) {
        return level;
      }
    }

    return userLevels[0];
  }

  private async getUserLevels(): Promise<IUserLevel[]> {
    // Implementation to get user levels from database
    return [];
  }
}

export const commissionService = CommissionService.getInstance(); 