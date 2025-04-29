import { Model, Types } from 'mongoose';
import { ICommission } from '../interfaces/ICommission';
import { IUser } from '../interfaces/IUser';
import { CommissionRecord } from '../models/commissionRecord';
import { StrategyPerformance } from '../models/StrategyPerformance';
import { Commission } from '../models/Commission';
import { User } from '../models/User';
import { NotFoundError } from '../utils/errors';

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
  async calculateAndDistributeCommission(performance: InstanceType<typeof StrategyPerformance> & { _id: Types.ObjectId }) {
    const { userId, profit, strategyId, _id } = performance;

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
        userId: new Types.ObjectId(user.referrerId.toString()),
        fromUserId: new Types.ObjectId(userId.toString()),
        amount: firstLevelCommission,
        level: 1,
        strategyId: new Types.ObjectId(strategyId.toString()),
        performanceId: _id
      });
    }

    // 4. 计算并分配二级推荐佣金
    if (user.referrerId) {
      const referrer = await User.findById(user.referrerId);
      if (referrer?.referrerId) {
        const secondLevelCommission = profit * CommissionService.SECOND_LEVEL_COMMISSION_RATE;
        await this.createCommissionRecord({
          userId: new Types.ObjectId(referrer.referrerId.toString()),
          fromUserId: new Types.ObjectId(userId.toString()),
          amount: secondLevelCommission,
          level: 2,
          strategyId: new Types.ObjectId(strategyId.toString()),
          performanceId: _id
        });
      }
    }

    // 5. 创建平台佣金记录
    await this.createCommissionRecord({
      userId: null, // 平台佣金
      fromUserId: new Types.ObjectId(userId.toString()),
      amount: platformCommission,
      level: 0,
      strategyId: new Types.ObjectId(strategyId.toString()),
      performanceId: _id
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
    userId: Types.ObjectId | null;
    fromUserId: Types.ObjectId;
    amount: number;
    level: number;
    strategyId: Types.ObjectId;
    performanceId: Types.ObjectId;
  }) {
    const commission = new Commission({
      ...data,
      status: 'pending'
    });
    return await commission.save();
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

  async getCommission(userId: string) {
    const commission = await Commission.findOne({ userId });
    if (!commission) {
      throw new NotFoundError('Commission not found');
    }
    return commission;
  }

  async updateCommission(userId: string, rate: number) {
    const commission = await Commission.findOneAndUpdate(
      { userId },
      { rate },
      { new: true, upsert: true }
    );
    return commission;
  }

  async getCommissionHistory(userId: string) {
    return this.commissionModel.find({ userId }).sort({ createdAt: -1 });
  }

  async getTotalCommission(userId: string) {
    const result = await this.commissionModel.aggregate([
      { $match: { userId: new Types.ObjectId(userId) } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    return result[0]?.total || 0;
  }

  async distributeCommission(commissionId: string) {
    const commission = await this.commissionModel.findById(commissionId);
    if (!commission) {
      throw new NotFoundError('Commission not found');
    }
    // Add distribution logic here
    return commission;
  }

  async createCommission(data: Partial<ICommission>) {
    return this.commissionModel.create(data);
  }
}

export const commissionService = CommissionService.getInstance(); 