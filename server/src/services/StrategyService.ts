import { IStrategy, IStrategyCreateInput, IStrategyDocument } from '../types/Strategy';
import { logger } from '../utils/logger';
import Strategy from '../models/strategy.model';
import { Document } from 'mongoose';

export class StrategyService {
  private static instance: StrategyService;
  
  private constructor() {}
  
  public static getInstance(): StrategyService {
    if (!StrategyService.instance) {
      StrategyService.instance = new StrategyService();
    }
    return StrategyService.instance;
  }

  async createStrategy(strategyData: IStrategyCreateInput): Promise<IStrategy> {
    try {
      const strategy = new Strategy(strategyData);
      return await strategy.save();
    } catch (error) {
      logger.error('Error in createStrategy:', error);
      throw error;
    }
  }

  async getStrategyById(id: string): Promise<IStrategy | null> {
    try {
      return await Strategy.findById(id);
    } catch (error) {
      logger.error('Error in getStrategyById:', error);
      throw error;
    }
  }

  async updateStrategy(id: string, updates: Partial<IStrategy>): Promise<IStrategy | null> {
    try {
      return await Strategy.findByIdAndUpdate(id, updates, { new: true });
    } catch (error) {
      logger.error('Error in updateStrategy:', error);
      throw error;
    }
  }

  async deleteStrategy(id: string): Promise<boolean> {
    try {
      const result = await Strategy.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      logger.error('Error in deleteStrategy:', error);
      throw error;
    }
  }

  async getAllStrategies(): Promise<IStrategy[]> {
    try {
      return await Strategy.find();
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

  async getStrategiesByUser(userId: string): Promise<IStrategy[]> {
    try {
      return await Strategy.find({ userId });
    } catch (error) {
      logger.error('Error in getStrategiesByUser:', error);
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
} 