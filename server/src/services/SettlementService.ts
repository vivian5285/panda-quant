import { Types } from 'mongoose';
import { Settlement } from '../models/settlement.model';
import { PlatformEarning, IPlatformEarning } from '../models/platformEarning.model';
import { NotFoundError } from '../utils/errors';
import { SettlementFilter, SettlementResponse, SettlementSummary } from '../types/Settlement';
import { Commission } from '../models/commission.model';
import { format } from 'date-fns';
import { Model } from 'mongoose';
import { logger } from '../utils/logger';
import { ISettlement, ISettlementDocument, SettlementMetadata, SettlementStatus } from '../types/Settlement';
import SettlementModel from '../models/settlement.model';
import { CommissionStatus } from '../types/Enums';
import User from '../models/user.model';

export class SettlementService {
  private static instance: SettlementService;
  private model: Model<ISettlementDocument>;
  private commissionModel: Model<any>;
  private platformEarningModel: Model<IPlatformEarning>;
  private userModel: Model<any>;

  private constructor() {
    this.model = SettlementModel as unknown as Model<ISettlementDocument>;
    this.commissionModel = Commission as unknown as Model<any>;
    this.platformEarningModel = PlatformEarning as unknown as Model<IPlatformEarning>;
    this.userModel = User as unknown as Model<any>;
  }

  public static getInstance(): SettlementService {
    if (!SettlementService.instance) {
      SettlementService.instance = new SettlementService();
    }
    return SettlementService.instance;
  }

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

    const settlements = await this.model.find(query)
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
      const metadata = settlement.metadata as SettlementMetadata;
      summary.platformTotal += metadata?.platformShare || 0;
      summary.level1Total += metadata?.level1Share || 0;
      summary.level2Total += metadata?.level2Share || 0;

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
      settlements,
      total: settlements.length
    };
  }

  async getSettlementDetails(id: string): Promise<ISettlementDocument | null> {
    try {
      const settlement = await this.model.findById(id);
      return settlement;
    } catch (error) {
      logger.error('Error getting settlement details:', error);
      throw error;
    }
  }

  async updateSettlementStatus(id: string, status: SettlementStatus): Promise<ISettlement | null> {
    try {
      const updatedSettlement = await SettlementModel.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      );
      if (!updatedSettlement) {
        return null;
      }
      return this.convertToISettlement(updatedSettlement);
    } catch (error) {
      logger.error('Error updating settlement status:', error);
      throw error;
    }
  }

  async exportSettlements(filter: SettlementFilter): Promise<string> {
    const response = await this.getSettlements(filter);
    const headers = ['ID', 'User ID', 'Amount', 'Commission IDs', 'Created At', 'Status'];
    const rows = response.settlements.map(settlement => [
      (settlement._id as Types.ObjectId).toString(),
      settlement.userId.toString(),
      settlement.amount.toString(),
      (settlement.metadata as SettlementMetadata)?.commissionIds?.join(',') || '',
      format(settlement.createdAt || new Date(), 'yyyy-MM-dd HH:mm:ss'),
      settlement.status
    ]);

    return [headers, ...rows].join('\n');
  }

  async generateSettlements(): Promise<void> {
    // 获取所有待结算的佣金记录
    const pendingCommissions = await this.commissionModel.find({ status: 'pending' })
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
      const totalAmount = commissions.reduce((sum: number, commission: any) => sum + commission.amount, 0);
      
      // 计算平台分成（10%）
      const platformShare = totalAmount * 0.1;
      
      // 计算用户实际收益（90%）
      const userShare = totalAmount * 0.9;
      
      // 获取用户的推荐关系
      const user = await this.userModel.findById(userId);
      if (!user) continue;

      // 计算推荐人分成
      let level1Share = 0;
      let level2Share = 0;
      
      if (user.referrerId) {
        // 第一代推荐人分成（20%）
        level1Share = totalAmount * 0.2;
        
        // 获取第二代推荐人
        const level1User = await this.userModel.findById(user.referrerId);
        if (level1User?.referrerId) {
          // 第二代推荐人分成（10%）
          level2Share = totalAmount * 0.1;
        }
      }

      // 创建结算记录
      const settlement = new Settlement({
        userId: new Types.ObjectId(userId),
        amount: userShare,
        type: 'deposit',
        status: 'pending',
        metadata: {
          commissionIds: commissions.map((c: any) => c._id),
          platformShare,
          level1Share,
          level2Share
        }
      });
      await settlement.save();

      // 更新佣金状态为已结算
      await this.commissionModel.updateMany(
        { _id: { $in: commissions.map((c: any) => c._id) } },
        { status: 'completed' }
      );
    }
  }

  async processPayment(id: string): Promise<ISettlement | null> {
    try {
      const settlement = await SettlementModel.findById(id);
      if (!settlement) {
        return null;
      }

      const updatedSettlement = await SettlementModel.findByIdAndUpdate(
        id,
        {
          status: SettlementStatus.COMPLETED,
          completedAt: new Date(),
          updatedAt: new Date()
        },
        { new: true }
      );
      return updatedSettlement ? this.convertToISettlement(updatedSettlement) : null;
    } catch (error) {
      logger.error('Error processing payment:', error);
      throw error;
    }
  }

  async createSettlement(
    userId: Types.ObjectId,
    amount: number,
    type: string,
    metadata?: Record<string, any>
  ): Promise<ISettlement> {
    const settlement = new this.model({
      userId,
      amount,
      type,
      status: SettlementStatus.PENDING,
      metadata,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await settlement.save();
    return settlement;
  }

  async getAllSettlements(): Promise<ISettlementDocument[]> {
    return await this.model.find().sort({ createdAt: -1 });
  }

  async getSettlementById(id: string): Promise<ISettlement | null> {
    try {
      const settlement = await SettlementModel.findById(id);
      if (!settlement) {
        return null;
      }
      return this.convertToISettlement(settlement);
    } catch (error) {
      logger.error('Error getting settlement by ID:', error);
      throw error;
    }
  }

  async updateSettlement(id: string, settlement: Partial<ISettlement>): Promise<ISettlement | null> {
    try {
      const updatedSettlement = await Settlement.findByIdAndUpdate(
        id,
        settlement,
        { new: true }
      );
      if (!updatedSettlement) {
        return null;
      }
      return this.convertToISettlement(updatedSettlement);
    } catch (error) {
      logger.error('Error updating settlement:', error);
      throw error;
    }
  }

  async deleteSettlement(id: string): Promise<boolean> {
    try {
      const result = await Settlement.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      logger.error('Error deleting settlement:', error);
      throw error;
    }
  }

  async createPlatformEarning(earningData: {
    userId: string;
    strategyId: string;
    amount: number;
    currency: string;
    type: 'commission' | 'fee' | 'other';
    description?: string;
    metadata?: Record<string, any>;
  }): Promise<IPlatformEarning> {
    const earning = new PlatformEarning(earningData);
    return await earning.save();
  }

  async getAllPlatformEarnings(): Promise<IPlatformEarning[]> {
    return await this.platformEarningModel.find().sort({ createdAt: -1 });
  }

  async getPlatformEarningById(id: string): Promise<IPlatformEarning> {
    const earning = await this.platformEarningModel.findById(id);
    if (!earning) {
      throw new NotFoundError('平台收益记录不存在');
    }
    return earning;
  }

  async updatePlatformEarning(id: string, earningData: Partial<IPlatformEarning>): Promise<IPlatformEarning> {
    const earning = await this.platformEarningModel.findByIdAndUpdate(id, earningData, { new: true });
    if (!earning) {
      throw new NotFoundError('平台收益记录不存在');
    }
    return earning;
  }

  async deletePlatformEarning(id: string): Promise<void> {
    const result = await this.platformEarningModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundError('Platform earning not found');
    }
  }

  public async calculateSettlementSummary(): Promise<SettlementSummary> {
    const settlements = await this.model.find();
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
      const metadata = settlement.metadata as SettlementMetadata;
      summary.platformTotal += metadata?.platformShare || 0;
      summary.level1Total += metadata?.level1Share || 0;
      summary.level2Total += metadata?.level2Share || 0;

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

    return summary;
  }

  public async processSettlement(settlement: ISettlementDocument): Promise<void> {
    try {
      const session = await this.model.startSession();
      session.startTransaction();

      try {
        // 更新结算状态
        settlement.status = SettlementStatus.COMPLETED;
        settlement.completedAt = new Date();
        await settlement.save({ session });

        // 更新相关佣金记录
        const metadata = settlement.metadata as SettlementMetadata;
        if (metadata?.commissionIds?.length) {
          await this.commissionModel.updateMany(
            { _id: { $in: metadata.commissionIds } },
            { status: CommissionStatus.COMPLETED },
            { session }
          );
        }

        // 创建平台收益记录
        if (metadata?.platformShare) {
          await this.platformEarningModel.create([{
            userId: (settlement._id as Types.ObjectId).toString(),
            strategyId: '',
            amount: metadata.platformShare,
            currency: 'USD',
            type: 'commission',
            description: 'Platform share from settlement',
            metadata: { settlementId: settlement._id }
          }], { session });
        }

        await session.commitTransaction();
      } catch (error) {
        await session.abortTransaction();
        throw error;
      } finally {
        session.endSession();
      }
    } catch (error) {
      logger.error('Error processing settlement:', error);
      throw error;
    }
  }

  public async getSettlementSummary(startDate: Date, endDate: Date): Promise<SettlementSummary> {
    const settlements = await this.model.find({
      createdAt: {
        $gte: startDate,
        $lte: endDate
      }
    });

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
      const metadata = settlement.metadata as SettlementMetadata;
      summary.platformTotal += metadata?.platformShare || 0;
      summary.level1Total += metadata?.level1Share || 0;
      summary.level2Total += metadata?.level2Share || 0;

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

    return summary;
  }

  public async getSettlementByUserId(userId: string): Promise<ISettlementDocument[]> {
    return await this.model.find({ userId: new Types.ObjectId(userId) });
  }

  public async getSettlementSummaryByUser(userId: string): Promise<{
    totalAmount: number;
    settlements: ISettlementDocument[];
  }> {
    const settlements = await this.getSettlementByUserId(userId);
    const totalAmount = settlements.reduce((sum: number, s: ISettlementDocument) => sum + s.amount, 0);
    return { totalAmount, settlements };
  }

  public async processPendingCommissions(): Promise<void> {
    const pendingCommissions = await this.commissionModel.find({ status: 'pending' });
    for (const commission of pendingCommissions) {
      const userId = commission.userId.toString();
      const amount = commission.amount;
      const metadata: SettlementMetadata = {
        commissionId: commission._id.toString(),
        platformShare: amount * 0.1,
        level1Share: amount * 0.2,
        level2Share: amount * 0.1
      };

      await this.createSettlement(new Types.ObjectId(userId), amount, 'deposit', metadata);
      commission.status = SettlementStatus.COMPLETED;
      await commission.save();
    }
  }

  public async getSettlementsByUserId(
    userId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{ settlements: ISettlementDocument[]; total: number }> {
    try {
      const skip = (page - 1) * limit;
      const query = { userId: new Types.ObjectId(userId) };
      
      const [settlements, total] = await Promise.all([
        this.model.find(query)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit),
        this.model.countDocuments(query)
      ]);

      return { settlements, total };
    } catch (error) {
      logger.error('Error getting settlements by user ID:', error);
      throw error;
    }
  }

  public async calculateTotalAmount(metadata: SettlementMetadata): Promise<number> {
    return (metadata.platformShare || 0) + (metadata.level1Share || 0) + (metadata.level2Share || 0);
  }

  private convertToISettlement(settlement: any): ISettlement {
    return {
      _id: settlement._id,
      userId: settlement.userId,
      amount: settlement.amount,
      type: settlement.type,
      status: settlement.status,
      referenceId: settlement._id,
      referenceType: 'settlement',
      description: settlement.description,
      metadata: settlement.metadata,
      completedAt: settlement.completedAt,
      createdAt: settlement.createdAt,
      updatedAt: settlement.updatedAt
    };
  }

  public async completeSettlement(id: string): Promise<ISettlement | null> {
    try {
      const settlement = await this.model.findById(id);
      if (!settlement) {
        return null;
      }

      settlement.status = SettlementStatus.COMPLETED;
      settlement.completedAt = new Date();
      const updatedSettlement = await settlement.save();
      return this.convertToISettlement(updatedSettlement);
    } catch (error) {
      logger.error('Error completing settlement:', error);
      throw error;
    }
  }

  public async failSettlement(id: string): Promise<ISettlement | null> {
    try {
      const settlement = await this.model.findByIdAndUpdate(
        id,
        { 
          $set: { 
            status: SettlementStatus.FAILED,
            completedAt: new Date()
          }
        },
        { new: true }
      );
      return settlement ? this.convertToISettlement(settlement) : null;
    } catch (error) {
      logger.error('Error failing settlement:', error);
      throw error;
    }
  }
} 