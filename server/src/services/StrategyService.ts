import { Types } from 'mongoose';
import { Strategy } from '../models/Strategy.model';
import { IStrategy, IStrategyDocument, StrategyCreateInput, StrategyUpdateInput } from '../types/Strategy';
import { StrategyType, StrategyStatus } from '../types/Enums';
import { logger } from '../utils/Logger';
import { Document } from 'mongoose';
import { AppError } from '../utils/AppError';

export class StrategyService {
  private static instance: StrategyService;
  
  private constructor() {}
  
  public static getInstance(): StrategyService {
    if (!StrategyService.instance) {
      StrategyService.instance = new StrategyService();
    }
    return StrategyService.instance;
  }

  async createStrategy(data: StrategyCreateInput): Promise<IStrategyDocument> {
    try {
      const strategy = new Strategy(data);
      return await strategy.save();
    } catch (error) {
      logger.error('Error creating strategy:', error);
      throw new AppError('Failed to create strategy', 500);
    }
  }

  async getStrategyById(id: string): Promise<IStrategyDocument | null> {
    try {
      return await Strategy.findById(id);
    } catch (error) {
      logger.error('Error getting strategy:', error);
      throw new AppError('Failed to get strategy', 500);
    }
  }

  async getStrategiesByUserId(userId: Types.ObjectId): Promise<IStrategyDocument[]> {
    try {
      return await Strategy.find({ userId });
    } catch (error) {
      logger.error('Error getting user strategies:', error);
      throw new AppError('Failed to get user strategies', 500);
    }
  }

  async updateStrategy(id: string, data: StrategyUpdateInput): Promise<IStrategyDocument | null> {
    try {
      return await Strategy.findByIdAndUpdate(id, data, { new: true });
    } catch (error) {
      logger.error('Error updating strategy:', error);
      throw new AppError('Failed to update strategy', 500);
    }
  }

  async deleteStrategy(id: string): Promise<void> {
    try {
      await Strategy.findByIdAndDelete(id);
    } catch (error) {
      logger.error('Error deleting strategy:', error);
      throw new AppError('Failed to delete strategy', 500);
    }
  }

  async getAllStrategies(): Promise<IStrategy[]> {
    try {
      const strategies = await Strategy.find();
      return strategies.map(strategy => this.convertToIStrategy(strategy));
    } catch (error) {
      logger.error('Error in getAllStrategies:', error);
      throw error;
    }
  }

  async startStrategy(strategy: IStrategy): Promise<void> {
    try {
      await Strategy.findByIdAndUpdate(strategy._id, { status: 'running' });
    } catch (error) {
      logger.error('Error in startStrategy:', error);
      throw error;
    }
  }

  async stopStrategy(strategy: IStrategy): Promise<void> {
    try {
      await Strategy.findByIdAndUpdate(strategy._id, { status: 'stopped' });
    } catch (error) {
      logger.error('Error in stopStrategy:', error);
      throw error;
    }
  }

  async pauseStrategy(strategy: IStrategy): Promise<void> {
    try {
      await Strategy.findByIdAndUpdate(strategy._id, { status: 'paused' });
    } catch (error) {
      logger.error('Error in pauseStrategy:', error);
      throw error;
    }
  }

  async resumeStrategy(strategy: IStrategy): Promise<void> {
    try {
      await Strategy.findByIdAndUpdate(strategy._id, { status: 'running' });
    } catch (error) {
      logger.error('Error in resumeStrategy:', error);
      throw error;
    }
  }

  async getActiveStrategies(): Promise<IStrategy[]> {
    try {
      return await Strategy.find({ status: 'running' });
    } catch (error) {
      logger.error('Error in getActiveStrategies:', error);
      throw error;
    }
  }

  async getPopularStrategies(limit: number): Promise<IStrategy[]> {
    try {
      return await Strategy.find()
        .sort({ usageCount: -1 })
        .limit(limit);
    } catch (error) {
      logger.error('Error in getPopularStrategies:', error);
      throw error;
    }
  }

  async getStrategyPerformance(id: string): Promise<IStrategy['performance'] | null> {
    try {
      const strategy = await Strategy.findById(id);
      if (!strategy) {
        return null;
      }
      return strategy.performance;
    } catch (error) {
      logger.error('Error getting strategy performance:', error);
      throw new AppError('Failed to get strategy performance', 500);
    }
  }

  async updateStrategyStatus(id: string, status: IStrategy['status']): Promise<IStrategyDocument | null> {
    try {
      return await Strategy.findByIdAndUpdate(id, { status }, { new: true });
    } catch (error) {
      logger.error('Error updating strategy status:', error);
      throw new AppError('Failed to update strategy status', 500);
    }
  }

  async getStrategyMetrics(id: string): Promise<IStrategy['performance'] | null> {
    try {
      const strategy = await Strategy.findById(id);
      if (!strategy) {
        return null;
      }
      return strategy.performance;
    } catch (error) {
      logger.error('Error getting strategy metrics:', error);
      throw new AppError('Failed to get strategy metrics', 500);
    }
  }

  async getStrategyHistory(id: string): Promise<Array<{ timestamp: Date; action: string; details: Record<string, any> }>> {
    try {
      const strategy = await Strategy.findById(id);
      if (!strategy || !strategy.metadata?.history) {
        return [];
      }
      return strategy.metadata.history;
    } catch (error) {
      logger.error('Error getting strategy history:', error);
      throw new AppError('Failed to get strategy history', 500);
    }
  }

  async getStrategyConfig(id: string): Promise<IStrategy['config'] | null> {
    try {
      const strategy = await Strategy.findById(id);
      if (!strategy) {
        return null;
      }
      return strategy.config;
    } catch (error) {
      logger.error('Error getting strategy config:', error);
      throw new AppError('Failed to get strategy config', 500);
    }
  }

  async updateStrategyConfig(id: string, config: IStrategy['config']): Promise<IStrategyDocument | null> {
    try {
      return await Strategy.findByIdAndUpdate(id, { config }, { new: true });
    } catch (error) {
      logger.error('Error updating strategy config:', error);
      throw new AppError('Failed to update strategy config', 500);
    }
  }

  private convertToIStrategy(strategy: IStrategyDocument): IStrategy {
    return {
      _id: strategy._id,
      userId: strategy.userId,
      name: strategy.name,
      description: strategy.description,
      type: strategy.type,
      status: strategy.status,
      config: strategy.config,
      performance: strategy.performance,
      metadata: strategy.metadata,
      createdAt: strategy.createdAt,
      updatedAt: strategy.updatedAt
    };
  }
} 