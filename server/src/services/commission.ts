import { Model, Types } from 'mongoose';
import { ICommission } from '../interfaces/ICommission';
import { IUser } from '../interfaces/IUser';
import { Commission } from '../models/Commission';
import { User } from '../models/User';

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

  async calculateCommission(userId: string, amount: number) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const commission = amount * 0.1; // 10% commission
    return commission;
  }

  // 获取用户团队信息
  async getTeamInfo(userId: string) {
    const teamMembers = await this.userModel.getTeamMembers(userId);
    const stats = await this.commissionModel.getTeamStats(userId);
    
    return {
      members: teamMembers,
      stats: {
        totalMembers: teamMembers.length,
        directMembers: teamMembers.filter(m => m.level === 1).length,
        totalCommission: stats.totalCommission,
        pendingCommission: stats.pendingCommission
      }
    };
  }

  // 获取用户佣金记录
  async getCommissionRecords(
    userId: string,
    page: number,
    limit: number,
    type?: string,
    status?: string
  ) {
    const offset = (page - 1) * limit;
    const records = await this.commissionModel.getUserCommissionRecords(
      userId,
      offset,
      limit,
      type,
      status
    );
    const total = await this.commissionModel.getUserCommissionRecordsCount(
      userId,
      type,
      status
    );

    return {
      records,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  // 获取所有用户的佣金统计
  async getAllUserCommissions(page: number, limit: number, search?: string) {
    const offset = (page - 1) * limit;
    const users = await this.userModel.getUsersWithCommission(
      offset,
      limit,
      search
    );
    const total = await this.userModel.getUsersWithCommissionCount(search);

    return {
      users,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  // 获取佣金趋势数据
  async getCommissionTrend(startDate?: string, endDate?: string) {
    return await this.commissionModel.getCommissionTrend(startDate, endDate);
  }

  async getTeamMembers(userId: Types.ObjectId) {
    return await User.find({ referrerId: userId });
  }

  async getTeamStats(userId: Types.ObjectId) {
    const teamMembers = await this.getTeamMembers(userId);
    const memberIds = teamMembers.map(member => member._id);

    const commissions = await Commission.find({
      userId: { $in: memberIds }
    });

    return {
      totalMembers: teamMembers.length,
      totalCommission: commissions.reduce((sum, commission) => sum + commission.amount, 0)
    };
  }

  async getUserCommissionRecords(userId: Types.ObjectId) {
    return await Commission.find({ userId });
  }

  async getUserCommissionRecordsCount(userId: Types.ObjectId) {
    return await Commission.countDocuments({ userId });
  }

  async getUsersWithCommission() {
    return await User.find({
      commissionBalance: { $gt: 0 }
    });
  }

  async getUsersWithCommissionCount() {
    return await User.countDocuments({
      commissionBalance: { $gt: 0 }
    });
  }

  async getCommissionTrend(userId: Types.ObjectId) {
    const commissions = await Commission.find({ userId })
      .sort({ createdAt: -1 })
      .limit(30);

    return commissions.map(commission => ({
      date: commission.createdAt,
      amount: commission.amount
    }));
  }
} 