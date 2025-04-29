import { StrategyPerformance, IStrategyPerformance } from '../models/StrategyPerformance';

export class StrategyPerformanceService {
  static async createStrategyPerformance(data: Omit<IStrategyPerformance, '_id' | 'createdAt' | 'updatedAt'>) {
    const strategyPerformance = new StrategyPerformance(data);
    return await strategyPerformance.save();
  }

  static async getStrategyPerformanceById(id: string) {
    return await StrategyPerformance.findById(id);
  }

  static async getStrategyPerformanceByStrategyId(strategyId: string) {
    return await StrategyPerformance.find({ strategyId });
  }

  static async getStrategyPerformanceByUserId(userId: string) {
    return await StrategyPerformance.find({ userId });
  }

  static async updateStrategyPerformance(id: string, data: Partial<IStrategyPerformance>) {
    return await StrategyPerformance.findByIdAndUpdate(id, data, { new: true });
  }

  static async deleteStrategyPerformance(id: string) {
    return await StrategyPerformance.findByIdAndDelete(id);
  }
} 