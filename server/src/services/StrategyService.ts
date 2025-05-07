import { Strategy } from '../models/Strategy';
import { logger } from '../utils/logger';
import type { IStrategy, IStrategyDocument, StrategyCreateInput } from '../types/Strategy';
import { Types } from 'mongoose';

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

  public async createStrategy(data: StrategyCreateInput): Promise<IStrategyDocument> {
    const strategy = new Strategy(data);
    return await strategy.save();
  }

  public async getStrategies(): Promise<IStrategyDocument[]> {
    return await Strategy.find();
  }

  async getStrategy(id: string): Promise<IStrategyDocument | null> {
    try {
      return await Strategy.findById(id);
    } catch (error) {
      logger.error('Error getting strategy:', error);
      throw error;
    }
  }

  async updateStrategy(id: string, updates: Partial<IStrategy>): Promise<IStrategyDocument | null> {
    try {
      return await Strategy.findByIdAndUpdate(id, updates, { new: true });
    } catch (error) {
      logger.error('Error updating strategy:', error);
      throw error;
    }
  }

  async deleteStrategy(id: string): Promise<IStrategyDocument | null> {
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

  async getAllStrategies(): Promise<IStrategyDocument[]> {
    try {
      return await Strategy.find();
    } catch (error) {
      logger.error('Error getting all strategies:', error);
      throw error;
    }
  }

  async getStrategiesByUser(userId: string): Promise<IStrategyDocument[]> {
    try {
      return await Strategy.find({ userId });
    } catch (error) {
      logger.error('Error getting strategies by user:', error);
      throw error;
    }
  }

  async getActiveStrategies(): Promise<IStrategyDocument[]> {
    try {
      return await Strategy.find({ status: StrategyStatus.ACTIVE });
    } catch (error) {
      logger.error('Error getting active strategies:', error);
      throw error;
    }
  }

  async getPopularStrategies(limit: number = 10): Promise<IStrategyDocument[]> {
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