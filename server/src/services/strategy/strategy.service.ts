import { Types } from 'mongoose';
import { logger } from '../../utils/logger';
import { Strategy } from '../../models/Strategy';
import { IStrategy } from '../../types/Strategy';

export class StrategyService {
  private static instance: StrategyService;
  private strategyModel: typeof Strategy;

  private constructor() {
    this.strategyModel = Strategy;
  }

  public static getInstance(): StrategyService {
    if (!StrategyService.instance) {
      StrategyService.instance = new StrategyService();
    }
    return StrategyService.instance;
  }

  public async createStrategy(strategyData: Partial<IStrategy>): Promise<IStrategy> {
    try {
      const strategy = new this.strategyModel(strategyData);
      const savedStrategy = await strategy.save();
      return savedStrategy.toObject() as IStrategy;
    } catch (error) {
      logger.error('Error creating strategy:', error);
      throw error;
    }
  }

  public async getStrategyById(id: Types.ObjectId): Promise<IStrategy | null> {
    try {
      const strategy = await this.strategyModel.findById(id);
      return strategy ? strategy.toObject() as IStrategy : null;
    } catch (error) {
      logger.error('Error getting strategy by ID:', error);
      throw error;
    }
  }

  public async updateStrategy(id: Types.ObjectId, updates: Partial<IStrategy>): Promise<IStrategy | null> {
    try {
      const strategy = await this.strategyModel.findByIdAndUpdate(id, updates, { new: true });
      return strategy ? strategy.toObject() as IStrategy : null;
    } catch (error) {
      logger.error('Error updating strategy:', error);
      throw error;
    }
  }

  public async deleteStrategy(id: Types.ObjectId): Promise<boolean> {
    try {
      const result = await this.strategyModel.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      logger.error('Error deleting strategy:', error);
      throw error;
    }
  }

  public async getStrategiesByUserId(userId: Types.ObjectId): Promise<IStrategy[]> {
    try {
      const strategies = await this.strategyModel.find({ userId });
      return strategies.map(strategy => strategy.toObject() as IStrategy);
    } catch (error) {
      logger.error('Error getting strategies by user ID:', error);
      throw error;
    }
  }
} 