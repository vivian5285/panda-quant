import { Strategy } from '../../models/strategy.model';
import { IStrategy, IStrategyCreateInput, IStrategyUpdateInput } from '../types/Strategy';
import { Types } from 'mongoose';
import { logger } from '../../utils/logger';

export class StrategyService {
  private static instance: StrategyService;

  private constructor() {}

  public static getInstance(): StrategyService {
    if (!StrategyService.instance) {
      StrategyService.instance = new StrategyService();
    }
    return StrategyService.instance;
  }

  public async createStrategy(strategyData: IStrategyCreateInput): Promise<IStrategy> {
    try {
      const strategy = new Strategy(strategyData);
      const savedStrategy = await strategy.save();
      return savedStrategy.toObject() as unknown as IStrategy;
    } catch (error) {
      logger.error('Error creating strategy:', error);
      throw error;
    }
  }

  public async getStrategyById(id: string): Promise<IStrategy | null> {
    try {
      const strategy = await Strategy.findById(id);
      return strategy ? strategy.toObject() as unknown as IStrategy : null;
    } catch (error) {
      logger.error('Error getting strategy by ID:', error);
      throw error;
    }
  }

  public async getStrategyByUserId(userId: string): Promise<IStrategy | null> {
    try {
      const strategy = await Strategy.findOne({ userId: new Types.ObjectId(userId) });
      return strategy ? strategy.toObject() as unknown as IStrategy : null;
    } catch (error) {
      logger.error('Error getting strategy by user ID:', error);
      throw error;
    }
  }

  public async updateStrategy(id: string, strategyData: IStrategyUpdateInput): Promise<IStrategy | null> {
    try {
      const strategy = await Strategy.findByIdAndUpdate(
        id,
        { $set: strategyData },
        { new: true }
      );
      return strategy ? strategy.toObject() as unknown as IStrategy : null;
    } catch (error) {
      logger.error('Error updating strategy:', error);
      throw error;
    }
  }

  public async deleteStrategy(id: string): Promise<boolean> {
    try {
      const result = await Strategy.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      logger.error('Error deleting strategy:', error);
      throw error;
    }
  }

  public async getAllStrategies(): Promise<IStrategy[]> {
    try {
      const strategies = await Strategy.find();
      return strategies.map(strategy => strategy.toObject() as unknown as IStrategy);
    } catch (error) {
      logger.error('Error getting all strategies:', error);
      throw error;
    }
  }
} 