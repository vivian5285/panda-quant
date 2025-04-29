import { Model } from 'mongoose';
import { ICommission } from '../interfaces/ICommission';
import { IUser } from '../interfaces/IUser';
import { CommissionRecord } from '../models/commissionRecord';
import { StrategyPerformance } from '../models/strategyPerformance';
import { Commission } from '../models/commission';
import { User } from '../models/user';

export class CommissionService {
  private static instance: CommissionService;
  private commissionModel: Model<ICommission>;
  private userModel: Model<IUser>;

  public static getInstance(): CommissionService {
    if (!CommissionService.instance) {
      CommissionService.instance = new CommissionService();
    }
    return CommissionService.instance;
  }

  constructor() {
    this.commissionModel = Commission;
    this.userModel = User;
  }

  // 平台佣金比例
  private static readonly PLATFORM_COMMISSION_RATE = 0.1; // 10%
  // 一级推荐佣金比例
  private static readonly FIRST_LEVEL_COMMISSION_RATE = 0.2; // 20%
  // 二级推荐佣金比例
  private static readonly SECOND_LEVEL_COMMISSION_RATE = 0.1; // 10%

  /**
   * 计算并分配佣金
   * @param performance 策略收益记录
   */
  async calculateAndDistributeCommission(performance: StrategyPerformance) {
    const { userId, profit, strategyId } = performance;

    // 1. 计算平台佣金
    const platformCommission = profit * CommissionService.PLATFORM_COMMISSION_RATE;
    
    // 2. 获取用户的推荐关系
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // 3. 计算并分配一级推荐佣金
    if (user.referrerId) {
      const firstLevelCommission = profit * CommissionService.FIRST_LEVEL_COMMISSION_RATE;
      await this.createCommissionRecord({
        userId: user.referrerId,
        fromUserId: userId,
        amount: firstLevelCommission,
        level: 1,
        strategyId,
        performanceId: performance._id
      });
    }

    // 4. 计算并分配二级推荐佣金
    if (user.referrerId) {
      const referrer = await User.findById(user.referrerId);
      if (referrer?.referrerId) {
        const secondLevelCommission = profit * CommissionService.SECOND_LEVEL_COMMISSION_RATE;
        await this.createCommissionRecord({
          userId: referrer.referrerId,
          fromUserId: userId,
          amount: secondLevelCommission,
          level: 2,
          strategyId,
          performanceId: performance._id
        });
      }
    }

    // 5. 创建平台佣金记录
    await this.createCommissionRecord({
      userId: null, // 平台佣金
      fromUserId: userId,
      amount: platformCommission,
      level: 0,
      strategyId,
      performanceId: performance._id
    });

    return {
      platformCommission,
      firstLevelCommission: user.referrerId ? profit * CommissionService.FIRST_LEVEL_COMMISSION_RATE : 0,
      secondLevelCommission: user.referrerId ? profit * CommissionService.SECOND_LEVEL_COMMISSION_RATE : 0
    };
  }

  /**
   * 创建佣金记录
   */
  private async createCommissionRecord(data: {
    userId: string | null;
    fromUserId: string;
    amount: number;
    level: number;
    strategyId: string;
    performanceId: string;
  }) {
    return await CommissionRecord.create({
      ...data,
      status: 'pending',
      createdAt: new Date()
    });
  }

  /**
   * 获取用户的佣金记录
   */
  async getUserCommissions(userId: string, options: {
    startDate?: Date;
    endDate?: Date;
    status?: 'pending' | 'paid';
  } = {}) {
    const query: any = { userId };
    
    if (options.startDate || options.endDate) {
      query.createdAt = {};
      if (options.startDate) query.createdAt.$gte = options.startDate;
      if (options.endDate) query.createdAt.$lte = options.endDate;
    }
    
    if (options.status) {
      query.status = options.status;
    }

    return await CommissionRecord.find(query)
      .populate('fromUserId', 'username')
      .populate('strategyId', 'name')
      .sort({ createdAt: -1 });
  }

  /**
   * 获取用户的佣金统计
   */
  async getUserCommissionStats(userId: string) {
    const [total, pending, paid] = await Promise.all([
      CommissionRecord.aggregate([
        { $match: { userId } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      CommissionRecord.aggregate([
        { $match: { userId, status: 'pending' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      CommissionRecord.aggregate([
        { $match: { userId, status: 'paid' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ])
    ]);

    return {
      total: total[0]?.total || 0,
      pending: pending[0]?.total || 0,
      paid: paid[0]?.total || 0
    };
  }

  async getTeamInfo(userId: string): Promise<any> {
    // Implementation
    return {};
  }

  async getCommissionRecords(userId: string): Promise<any[]> {
    // Implementation
    return [];
  }

  async getCommissionTrend(userId: string): Promise<any[]> {
    // Implementation
    return [];
  }
}

export const commissionService = CommissionService.getInstance(); 