import { Strategy } from '../models/strategy.model';
import Trade from '../models/trade.model';
import { IStrategy, IStrategyDocument, IStrategyCreateInput, IStrategyUpdateInput } from '../types/Strategy';
import { ITrade, ITradeDocument } from '../types/Trade';
import { Types } from 'mongoose';
import { logger } from '../utils/logger';
import { StrategyStatus, StrategyType } from '../types/Enums';
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

  private convertToITrade(trade: ITradeDocument): ITrade {
    const tradeObject = trade.toObject();
    return {
      userId: tradeObject.userId,
      strategyId: tradeObject.strategyId,
      symbol: tradeObject.symbol,
      type: tradeObject.type,
      side: tradeObject.side,
      quantity: tradeObject.quantity,
      price: tradeObject.price,
      status: tradeObject.status,
      executedAt: tradeObject.executedAt,
      metadata: tradeObject.metadata,
      createdAt: tradeObject.createdAt,
      updatedAt: tradeObject.updatedAt
    };
  }

  private convertToIStrategy(strategy: IStrategyDocument): IStrategy {
    const strategyObject = strategy.toObject();
    return {
      userId: strategyObject.userId,
      name: strategyObject.name,
      description: strategyObject.description,
      type: strategyObject.type,
      status: strategyObject.status,
      config: strategyObject.config,
      performance: strategyObject.performance,
      metadata: strategyObject.metadata,
      createdAt: strategyObject.createdAt,
      updatedAt: strategyObject.updatedAt
    } as IStrategy;
  }

  async createStrategy(strategyData: IStrategyCreateInput): Promise<IStrategy> {
    try {
      const strategy = new Strategy({
        ...strategyData,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      const savedStrategy = await strategy.save();
      return this.convertToIStrategy(savedStrategy as unknown as IStrategyDocument);
    } catch (error) {
      logger.error('Error creating strategy:', error);
      throw new AppError('Failed to create strategy', 500);
    }
  }

  async getStrategyById(id: string): Promise<IStrategy | null> {
    try {
      const strategy = await Strategy.findById(id);
      if (!strategy) return null;
      return this.convertToIStrategy(strategy as unknown as IStrategyDocument);
    } catch (error) {
      logger.error(`Error getting strategy ${id}:`, error);
      throw new AppError('Failed to get strategy', 500);
    }
  }

  async updateStrategy(id: string, updates: IStrategyUpdateInput): Promise<IStrategy | null> {
    try {
      const strategy = await Strategy.findByIdAndUpdate(
        id,
        { ...updates, updatedAt: new Date() },
        { new: true }
      );
      if (!strategy) return null;
      return this.convertToIStrategy(strategy as unknown as IStrategyDocument);
    } catch (error) {
      logger.error(`Error updating strategy ${id}:`, error);
      throw new AppError('Failed to update strategy', 500);
    }
  }

  async deleteStrategy(id: string): Promise<boolean> {
    try {
      const result = await Strategy.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      logger.error(`Error deleting strategy ${id}:`, error);
      throw new AppError('Failed to delete strategy', 500);
    }
  }

  async getAllStrategies(): Promise<IStrategy[]> {
    try {
      const strategies = await Strategy.find();
      return strategies.map(strategy => this.convertToIStrategy(strategy as unknown as IStrategyDocument));
    } catch (error) {
      logger.error('Error getting all strategies:', error);
      throw new AppError('Failed to get strategies', 500);
    }
  }

  async startStrategy(strategy: IStrategy): Promise<void> {
    try {
      // 实现启动策略的逻辑
      logger.info(`Strategy ${strategy._id} started`);
    } catch (error) {
      logger.error(`Error starting strategy ${strategy._id}:`, error);
      throw new AppError('Failed to start strategy', 500);
    }
  }

  async stopStrategy(strategy: IStrategy): Promise<void> {
    try {
      // 实现停止策略的逻辑
      logger.info(`Strategy ${strategy._id} stopped`);
    } catch (error) {
      logger.error(`Error stopping strategy ${strategy._id}:`, error);
      throw new AppError('Failed to stop strategy', 500);
    }
  }

  async pauseStrategy(strategy: IStrategy): Promise<void> {
    try {
      // 实现暂停策略的逻辑
      logger.info(`Strategy ${strategy._id} paused`);
    } catch (error) {
      logger.error(`Error pausing strategy ${strategy._id}:`, error);
      throw new AppError('Failed to pause strategy', 500);
    }
  }

  async resumeStrategy(strategy: IStrategy): Promise<void> {
    try {
      // 实现恢复策略的逻辑
      logger.info(`Strategy ${strategy._id} resumed`);
    } catch (error) {
      logger.error(`Error resuming strategy ${strategy._id}:`, error);
      throw new AppError('Failed to resume strategy', 500);
    }
  }

  async getStrategiesByUser(userId: string): Promise<IStrategy[]> {
    try {
      const strategies = await Strategy.find({ userId: new Types.ObjectId(userId) });
      return strategies.map(strategy => this.convertToIStrategy(strategy as unknown as IStrategyDocument));
    } catch (error) {
      logger.error('Error getting strategies by user:', error);
      throw new AppError('Failed to get user strategies', 500);
    }
  }

  async getActiveStrategies(): Promise<IStrategy[]> {
    try {
      const strategies = await Strategy.find({ status: StrategyStatus.ACTIVE });
      return strategies.map(strategy => this.convertToIStrategy(strategy as unknown as IStrategyDocument));
    } catch (error) {
      logger.error('Error getting active strategies:', error);
      throw new AppError('Failed to get active strategies', 500);
    }
  }

  async getPopularStrategies(limit: number = 10): Promise<IStrategy[]> {
    try {
      const strategies = await Strategy.find()
        .sort({ followers: -1 })
        .limit(limit);
      return strategies.map(strategy => this.convertToIStrategy(strategy as unknown as IStrategyDocument));
    } catch (error) {
      logger.error('Error getting popular strategies:', error);
      throw new AppError('Failed to get popular strategies', 500);
    }
  }

  async getTradesByStrategyId(strategyId: string): Promise<ITrade[]> {
    try {
      const trades = await Trade.find({ strategyId: new Types.ObjectId(strategyId) });
      return trades.map(trade => this.convertToITrade(trade as unknown as ITradeDocument));
    } catch (error) {
      logger.error('Error getting trades by strategy id:', error);
      throw new AppError('Failed to get strategy trades', 500);
    }
  }
} 