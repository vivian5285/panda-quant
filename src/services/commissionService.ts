import { ICommission } from '../interfaces/ICommission';
import { IUser } from '../interfaces/IUser';
import { StrategyPerformance } from '../types/strategy';
import { Commission } from '../models/commission';
import { User } from '../models/user';

export class CommissionService {
  // ... existing code ...

  async getUserCommissions(userId: string): Promise<ICommission[]> {
    return Commission.find({ userId }).exec();
  }

  async createCommission(data: Partial<ICommission>): Promise<ICommission> {
    const commission = new Commission(data);
    return commission.save();
  }

  async getAllUserCommissions(userId: string): Promise<ICommission[]> {
    return Commission.find({ userId }).exec();
  }

  async calculateCommission(user: IUser, performance: StrategyPerformance): Promise<number> {
    // 实现佣金计算逻辑
    return 0;
  }

  async distributeCommission(userId: string, amount: number): Promise<void> {
    // 实现佣金分配逻辑
  }

  async getCommissionHistory(userId: string): Promise<ICommission[]> {
    return Commission.find({ userId })
      .sort({ createdAt: -1 })
      .exec();
  }

  async getTotalCommission(userId: string): Promise<number> {
    const result = await Commission.aggregate([
      { $match: { userId } },
      { $group: { _id: null, total: { $sum: '$commission' } } }
    ]);
    return result[0]?.total || 0;
  }
} 