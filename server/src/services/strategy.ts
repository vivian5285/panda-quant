import { Types } from 'mongoose';
import { Strategy } from '../models/Strategy';
import { StrategyPerformance } from '../models/strategyPerformance';
import { IStrategy } from '../interfaces/IStrategy';
import { IStrategyPerformance } from '../interfaces/IStrategyPerformance';

export class StrategyService {
  async createStrategy(strategy: Partial<IStrategy>) {
    const newStrategy = new Strategy(strategy);
    return await newStrategy.save();
  }

  async getStrategyById(id: Types.ObjectId) {
    return await Strategy.findById(id);
  }

  async updateStrategy(id: Types.ObjectId, updates: Partial<IStrategy>) {
    return await Strategy.findByIdAndUpdate(id, updates, { new: true });
  }

  async deleteStrategy(id: Types.ObjectId) {
    return await Strategy.findByIdAndDelete(id);
  }

  async getStrategyPerformance(strategyId: Types.ObjectId) {
    return await StrategyPerformance.findOne({ strategyId });
  }

  async updateStrategyPerformance(strategyId: Types.ObjectId, performance: Partial<IStrategyPerformance>) {
    return await StrategyPerformance.findOneAndUpdate(
      { strategyId },
      performance,
      { new: true, upsert: true }
    );
  }

  async getStrategiesByUser(userId: Types.ObjectId) {
    return await Strategy.find({ userId });
  }

  async getStrategyStats(userId: Types.ObjectId) {
    const strategies = await this.getStrategiesByUser(userId);
    const performances = await StrategyPerformance.find({
      strategyId: { $in: strategies.map(s => s._id) }
    });

    return {
      totalStrategies: strategies.length,
      totalProfit: performances.reduce((sum, p) => sum + (p.profit || 0), 0),
      activeStrategies: strategies.filter(s => s.status === 'active').length
    };
  }
} 