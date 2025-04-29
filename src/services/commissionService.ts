import { ICommission } from '../interfaces/ICommission';
import { IUser } from '../interfaces/IUser';
import { StrategyPerformance } from '../types/strategy';

export class CommissionService {
  // ... existing code ...

  async getUserCommissions(userId: string): Promise<ICommission[]> {
    // Implementation
  }

  async createCommission(data: Partial<ICommission>): Promise<ICommission> {
    // Implementation
  }

  async getAllUserCommissions(userId: string): Promise<ICommission[]> {
    // Implementation
  }
} 