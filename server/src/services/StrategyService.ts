import { Strategy } from '../models/Strategy';
import { logger } from '../utils/logger';
import { IStrategy } from '../types/strategy';

export enum StrategyStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PAUSED = 'paused'
}

export class StrategyService {
  private static instance: StrategyService;

  private constructor() {}

  public static getInstance(): StrategyService {
    if (!StrategyService.instance) {
      StrategyService.instance = new StrategyService();
    }
    return StrategyService.instance;
  }

  async createStrategy(strategy: Partial<IStrategy>): Promise<IStrategy> {
    try {
      const newStrategy = new Strategy(strategy);
      return await newStrategy.save();
    } catch (error) {
      logger.error('Error creating strategy:', error);
      throw error;
    }
  }

  async getStrategies(userId: string): Promise<IStrategy[]> {
    try {
      return await Strategy.find({ userId });
    } catch (error) {
      logger.error('Error getting strategies:', error);
      throw error;
    }
  }

  async getStrategy(id: string): Promise<IStrategy | null> {
    try {
      return await Strategy.findById(id);
    } catch (error) {
      logger.error('Error getting strategy:', error);
      throw error;
    }
  }

  async updateStrategy(id: string, updates: Partial<IStrategy>): Promise<IStrategy | null> {
    try {
      return await Strategy.findByIdAndUpdate(id, updates, { new: true });
    } catch (error) {
      logger.error('Error updating strategy:', error);
      throw error;
    }
  }

  async deleteStrategy(id: string): Promise<IStrategy | null> {
    try {
      return await Strategy.findByIdAndUpdate(id, { status: StrategyStatus.INACTIVE }, { new: true });
    } catch (error) {
      logger.error('Error deleting strategy:', error);
      throw error;
    }
  }

  async getStrategyPerformance(strategyId: string): Promise<any> {
    try {
      const strategy = await this.getStrategy(strategyId);
      if (!strategy) {
        throw new Error('Strategy not found');
      }
      
      // TODO: 实现实际的性能计算逻辑
      return {
        totalProfit: 0,
        winRate: 0,
        trades: []
      };
    } catch (error) {
      logger.error('Error getting strategy performance:', error);
      throw error;
    }
  }

  async getAllStrategies(): Promise<IStrategy[]> {
    try {
      return await Strategy.find();
    } catch (error) {
      logger.error('Error getting all strategies:', error);
      throw error;
    }
  }

  async getStrategiesByUser(userId: string): Promise<IStrategy[]> {
    try {
      return await Strategy.find({ userId });
    } catch (error) {
      logger.error('Error getting strategies by user:', error);
      throw error;
    }
  }

  async getActiveStrategies(): Promise<IStrategy[]> {
    try {
      return await Strategy.find({ status: StrategyStatus.ACTIVE });
    } catch (error) {
      logger.error('Error getting active strategies:', error);
      throw error;
    }
  }

  async getPopularStrategies(limit: number = 10): Promise<IStrategy[]> {
    try {
      return await Strategy.find()
        .sort({ followers: -1 })
        .limit(limit);
    } catch (error) {
      logger.error('Error getting popular strategies:', error);
      throw error;
    }
  }
} 