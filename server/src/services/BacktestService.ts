import { Types } from 'mongoose';
import { IBacktest, IBacktestDocument, BacktestCreateInput } from '../types/Backtest';
import { Backtest } from '../models/backtest.model';
import { logger } from '../utils/logger';
import { AppError } from '../utils/AppError';

export class BacktestService {
  private static instance: BacktestService;

  private constructor() {}

  public static getInstance(): BacktestService {
    if (!BacktestService.instance) {
      BacktestService.instance = new BacktestService();
    }
    return BacktestService.instance;
  }

  private convertToIBacktest(doc: IBacktestDocument): IBacktest {
    const obj = doc.toObject();
    return {
      _id: obj._id,
      userId: obj.userId,
      strategyId: obj.strategyId,
      name: obj.name,
      description: obj.description,
      period: obj.period,
      parameters: obj.parameters,
      results: obj.results,
      status: obj.status,
      error: obj.error,
      metadata: obj.metadata,
      createdAt: obj.createdAt,
      updatedAt: obj.updatedAt
    };
  }

  public async createBacktest(backtestData: BacktestCreateInput): Promise<IBacktest> {
    try {
      const backtest = new Backtest(backtestData);
      const savedBacktest = await backtest.save();
      return this.convertToIBacktest(savedBacktest);
    } catch (error) {
      logger.error('Error creating backtest:', error);
      throw new AppError('Failed to create backtest', 500);
    }
  }

  public async getBacktestById(id: string): Promise<IBacktest | null> {
    try {
      const backtest = await Backtest.findById(id);
      if (!backtest) return null;
      return this.convertToIBacktest(backtest);
    } catch (error) {
      logger.error('Error getting backtest:', error);
      throw new AppError('Failed to get backtest', 500);
    }
  }

  public async getBacktestsByUserId(userId: string): Promise<IBacktest[]> {
    try {
      const backtests = await Backtest.find({ userId: new Types.ObjectId(userId) });
      return backtests.map(backtest => this.convertToIBacktest(backtest));
    } catch (error) {
      logger.error('Error getting backtests:', error);
      throw new AppError('Failed to get backtests', 500);
    }
  }

  public async getBacktestByStrategyId(strategyId: string): Promise<IBacktest | null> {
    try {
      const backtest = await Backtest.findOne({ strategyId: new Types.ObjectId(strategyId) });
      if (!backtest) return null;
      return this.convertToIBacktest(backtest);
    } catch (error) {
      logger.error('Error getting backtest:', error);
      throw new AppError('Failed to get backtest', 500);
    }
  }
} 