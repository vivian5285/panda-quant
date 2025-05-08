import { Strategy } from '../models/strategy.model';
import { Trade } from '../models/trade.model';
import { IStrategy } from '../types/Strategy';
import { ITrade } from '../types/Trading';
import { Types } from 'mongoose';
import { logger } from '../utils/logger';
import { StrategyStatus } from '../types/Enums';

export class StrategyService {
  private static instance: StrategyService;

  private constructor() {}

  public static getInstance(): StrategyService {
    if (!StrategyService.instance) {
      StrategyService.instance = new StrategyService();
    }
    return StrategyService.instance;
  }

  async createStrategy(strategyData: Partial<IStrategy>): Promise<IStrategy> {
    const strategy = new Strategy(strategyData);
    const savedStrategy = await strategy.save();
    return savedStrategy.toObject() as unknown as IStrategy;
  }

  async getStrategyById(id: string): Promise<IStrategy | null> {
    const strategy = await Strategy.findById(id);
    return strategy ? strategy.toObject() as unknown as IStrategy : null;
  }

  async updateStrategy(id: string, updates: Partial<IStrategy>): Promise<IStrategy | null> {
    const strategy = await Strategy.findByIdAndUpdate(id, updates, { new: true });
    return strategy ? strategy.toObject() as unknown as IStrategy : null;
  }

  async deleteStrategy(id: string): Promise<boolean> {
    const result = await Strategy.findByIdAndDelete(id);
    return !!result;
  }

  async getAllStrategies(): Promise<IStrategy[]> {
    const strategies = await Strategy.find();
    return strategies.map(strategy => strategy.toObject() as unknown as IStrategy);
  }

  async startStrategy(strategy: IStrategy): Promise<void> {
    try {
      // 实现启动策略的逻辑
      logger.info(`Strategy ${strategy._id} started`);
    } catch (error) {
      logger.error(`Error starting strategy ${strategy._id}:`, error);
      throw error;
    }
  }

  async stopStrategy(strategy: IStrategy): Promise<void> {
    try {
      // 实现停止策略的逻辑
      logger.info(`Strategy ${strategy._id} stopped`);
    } catch (error) {
      logger.error(`Error stopping strategy ${strategy._id}:`, error);
      throw error;
    }
  }

  async pauseStrategy(strategy: IStrategy): Promise<void> {
    try {
      // 实现暂停策略的逻辑
      logger.info(`Strategy ${strategy._id} paused`);
    } catch (error) {
      logger.error(`Error pausing strategy ${strategy._id}:`, error);
      throw error;
    }
  }

  async resumeStrategy(strategy: IStrategy): Promise<void> {
    try {
      // 实现恢复策略的逻辑
      logger.info(`Strategy ${strategy._id} resumed`);
    } catch (error) {
      logger.error(`Error resuming strategy ${strategy._id}:`, error);
      throw error;
    }
  }

  async getStrategiesByUser(userId: string): Promise<IStrategy[]> {
    try {
      const strategies = await Strategy.find({ userId });
      return strategies.map(strategy => strategy.toObject() as unknown as IStrategy);
    } catch (error) {
      logger.error('Error getting strategies by user:', error);
      throw error;
    }
  }

  async getActiveStrategies(): Promise<IStrategy[]> {
    try {
      const strategies = await Strategy.find({ status: StrategyStatus.ACTIVE });
      return strategies.map(strategy => strategy.toObject() as unknown as IStrategy);
    } catch (error) {
      logger.error('Error getting active strategies:', error);
      throw error;
    }
  }

  async getPopularStrategies(limit: number = 10): Promise<IStrategy[]> {
    try {
      const strategies = await Strategy.find()
        .sort({ followers: -1 })
        .limit(limit);
      return strategies.map(strategy => strategy.toObject() as unknown as IStrategy);
    } catch (error) {
      logger.error('Error getting popular strategies:', error);
      throw error;
    }
  }

  async getStrategyTrades(strategyId: string): Promise<ITrade[]> {
    try {
      const trades = await Trade.find({ strategyId });
      return trades.map(trade => trade.toObject() as unknown as ITrade);
    } catch (error) {
      logger.error('Error getting strategy trades:', error);
      throw error;
    }
  }
} 