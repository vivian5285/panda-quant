import { Settlement, SettlementFilter, SettlementResponse, SettlementSummary } from '../types/settlement';
import { Commission } from '../models/Commission';
import { Settlement as SettlementModel } from '../models/Settlement';
import { PlatformEarning } from '../models/PlatformEarning';
import { UserEarning } from '../models/UserEarning';
import { User } from '../models/User';
import { format } from 'date-fns';

export class SettlementService {
  async getSettlements(filter: SettlementFilter): Promise<SettlementResponse> {
    const query: any = {};
    
    if (filter.startDate) {
      query.createdAt = { $gte: filter.startDate };
    }
    if (filter.endDate) {
      query.createdAt = { ...query.createdAt, $lte: filter.endDate };
    }
    if (filter.userId) {
      query.userId = filter.userId;
    }
    if (filter.status && filter.status !== 'all') {
      query.status = filter.status;
    }

    const settlements = await SettlementModel.find(query)
      .populate('userId', 'username email')
      .sort({ createdAt: -1 });

    const summary: SettlementSummary = {
      totalAmount: 0,
      totalCount: settlements.length,
      pendingCount: 0,
      completedCount: 0,
      failedCount: 0,
      platformTotal: 0,
      level1Total: 0,
      level2Total: 0
    };

    settlements.forEach(settlement => {
      summary.totalAmount += settlement.amount;
      summary.platformTotal += settlement.platformShare;
      summary.level1Total += settlement.level1Share;
      summary.level2Total += settlement.level2Share;

      switch (settlement.status) {
        case 'pending':
          summary.pendingCount++;
          break;
        case 'completed':
          summary.completedCount++;
          break;
        case 'failed':
          summary.failedCount++;
          break;
      }
    });

    return {
      settlements: settlements.map(s => ({
        id: s._id.toString(),
        userId: s.userId._id.toString(),
        amount: s.amount,
        commissionIds: s.commissionIds.map(id => id.toString()),
        createdAt: s.createdAt,
        status: s.status,
        platformShare: s.platformShare,
        level1Share: s.level1Share,
        level2Share: s.level2Share
      })),
      summary
    };
  }

  async getSettlementDetails(id: string): Promise<Settlement> {
    const settlement = await SettlementModel.findById(id)
      .populate('userId', 'username email')
      .populate('commissionIds');

    if (!settlement) {
      throw new Error('Settlement not found');
    }

    return {
      id: settlement._id.toString(),
      userId: settlement.userId._id.toString(),
      amount: settlement.amount,
      commissionIds: settlement.commissionIds.map(id => id.toString()),
      createdAt: settlement.createdAt,
      status: settlement.status,
      platformShare: settlement.platformShare,
      level1Share: settlement.level1Share,
      level2Share: settlement.level2Share
    };
  }

  async updateSettlementStatus(id: string, status: 'completed' | 'failed'): Promise<void> {
    const settlement = await SettlementModel.findById(id);
    if (!settlement) {
      throw new Error('Settlement not found');
    }

    settlement.status = status;
    await settlement.save();
  }

  async exportSettlements(filter: SettlementFilter): Promise<string> {
    const response = await this.getSettlements(filter);
    const headers = ['ID', 'User ID', 'Amount', 'Commission IDs', 'Created At', 'Status'];
    const rows = response.settlements.map(settlement => [
      settlement.id,
      settlement.userId,
      settlement.amount.toString(),
      settlement.commissionIds.join(','),
      format(settlement.createdAt, 'yyyy-MM-dd HH:mm:ss'),
      settlement.status
    ]);

    return [headers, ...rows].join('\n');
  }

  async generateSettlements(): Promise<void> {
    // 获取所有待结算的佣金记录
    const pendingCommissions = await Commission.find({ status: 'pending' })
      .sort({ createdAt: 1 });

    // 按用户分组佣金
    const userCommissions = new Map<string, any[]>();
    pendingCommissions.forEach(commission => {
      const userId = commission.userId.toString();
      if (!userCommissions.has(userId)) {
        userCommissions.set(userId, []);
      }
      userCommissions.get(userId)?.push(commission);
    });

    // 为每个用户生成结算记录
    for (const [userId, commissions] of userCommissions) {
      const totalAmount = commissions.reduce((sum, commission) => sum + commission.amount, 0);
      
      // 计算平台分成（10%）
      const platformShare = totalAmount * 0.1;
      
      // 计算用户实际收益（90%）
      const userShare = totalAmount * 0.9;
      
      // 获取用户的推荐关系
      const user = await User.findById(userId);
      if (!user) continue;

      // 计算推荐人分成
      let level1Share = 0;
      let level2Share = 0;
      
      if (user.referrerId) {
        // 第一代推荐人分成（20%）
        level1Share = totalAmount * 0.2;
        
        // 获取第二代推荐人
        const level1User = await User.findById(user.referrerId);
        if (level1User?.referrerId) {
          // 第二代推荐人分成（10%）
          level2Share = totalAmount * 0.1;
        }
      }

      // 创建结算记录
      const settlement = new SettlementModel({
        userId: user._id,
        amount: userShare,
        commissionIds: commissions.map(c => c._id),
        status: 'pending',
        platformShare,
        level1Share,
        level2Share
      });
      await settlement.save();

      // 更新佣金状态为已结算
      await Commission.updateMany(
        { _id: { $in: commissions.map(c => c._id) } },
        { status: 'completed' }
      );
    }
  }

  async processPayment(id: string): Promise<void> {
    const settlement = await SettlementModel.findById(id);
    if (!settlement) {
      throw new Error('Settlement not found');
    }

    if (settlement.status !== 'pending') {
      throw new Error('Settlement is not in pending status');
    }

    // 开始事务
    const session = await SettlementModel.startSession();
    session.startTransaction();

    try {
      // 更新结算状态为已完成
      settlement.status = 'completed';
      await settlement.save({ session });

      // 处理平台分成
      const platformEarning = new PlatformEarning({
        settlementId: settlement._id,
        amount: settlement.platformShare
      });
      await platformEarning.save({ session });

      // 处理第一代推荐人分成
      if (settlement.level1Share > 0) {
        const user = await User.findById(settlement.userId);
        if (user?.referrerId) {
          const userEarning = new UserEarning({
            userId: user.referrerId,
            settlementId: settlement._id,
            amount: settlement.level1Share,
            level: 1
          });
          await userEarning.save({ session });
        }
      }

      // 处理第二代推荐人分成
      if (settlement.level2Share > 0) {
        const user = await User.findById(settlement.userId);
        if (user?.referrerId) {
          const level1User = await User.findById(user.referrerId);
          if (level1User?.referrerId) {
            const userEarning = new UserEarning({
              userId: level1User.referrerId,
              settlementId: settlement._id,
              amount: settlement.level2Share,
              level: 2
            });
            await userEarning.save({ session });
          }
        }
      }

      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }
} 
} 