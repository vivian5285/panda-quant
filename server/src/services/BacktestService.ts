import { Types } from 'mongoose';
import { Backtest } from '../models/backtest';
import { logger } from '../utils/logger';

export interface IBacktest {
  _id: Types.ObjectId;
  strategyId: Types.ObjectId;
  userId: Types.ObjectId;
  startDate: Date;
  endDate: Date;
  initialBalance: number;
  finalBalance: number;
  totalReturn: number;
  annualizedReturn: number;
  sharpeRatio: number;
  maxDrawdown: number;
  winRate: number;
  profitFactor: number;
  averageTrade: number;
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  createdAt: Date;
  updatedAt: Date;
}

export class BacktestService {
  async createBacktest(data: Omit<IBacktest, '_id' | 'createdAt' | 'updatedAt'>): Promise<IBacktest> {
    try {
      const backtest = new Backtest(data);
      const savedBacktest = await backtest.save();
      const objectId = new Types.ObjectId((savedBacktest._id as unknown as { toString(): string }).toString());
      return {
        ...savedBacktest.toObject(),
        _id: objectId,
        initialBalance: data.initialBalance,
        finalBalance: data.finalBalance,
        totalReturn: data.totalReturn,
        annualizedReturn: data.annualizedReturn,
        averageTrade: data.averageTrade
      };
    } catch (error) {
      logger.error('Error creating backtest:', error);
      throw error;
    }
  }

  async getBacktestById(id: string): Promise<IBacktest | null> {
    try {
      const backtest = await Backtest.findById(id);
      if (!backtest) return null;
      const objectId = new Types.ObjectId((backtest._id as unknown as { toString(): string }).toString());
      return {
        ...backtest.toObject(),
        _id: objectId,
        initialBalance: backtest.initialBalance || 0,
        finalBalance: backtest.finalBalance || 0,
        totalReturn: backtest.totalReturn || 0,
        annualizedReturn: backtest.annualizedReturn || 0,
        averageTrade: backtest.averageTrade || 0
      };
    } catch (error) {
      logger.error('Error getting backtest:', error);
      throw error;
    }
  }

  async getBacktestsByStrategyId(strategyId: string): Promise<IBacktest[]> {
    try {
      const backtests = await Backtest.find({ strategyId });
      return backtests.map(backtest => {
        const objectId = new Types.ObjectId((backtest._id as unknown as { toString(): string }).toString());
        return {
          ...backtest.toObject(),
          _id: objectId,
          initialBalance: backtest.initialBalance || 0,
          finalBalance: backtest.finalBalance || 0,
          totalReturn: backtest.totalReturn || 0,
          annualizedReturn: backtest.annualizedReturn || 0,
          averageTrade: backtest.averageTrade || 0
        };
      });
    } catch (error) {
      logger.error('Error getting backtests:', error);
      throw error;
    }
  }

  async updateBacktest(id: string, data: Partial<IBacktest>): Promise<IBacktest | null> {
    try {
      const backtest = await Backtest.findByIdAndUpdate(id, data, { new: true });
      if (!backtest) return null;
      const objectId = new Types.ObjectId((backtest._id as unknown as { toString(): string }).toString());
      return {
        ...backtest.toObject(),
        _id: objectId,
        initialBalance: backtest.initialBalance || 0,
        finalBalance: backtest.finalBalance || 0,
        totalReturn: backtest.totalReturn || 0,
        annualizedReturn: backtest.annualizedReturn || 0,
        averageTrade: backtest.averageTrade || 0
      };
    } catch (error) {
      logger.error('Error updating backtest:', error);
      throw error;
    }
  }

  async deleteBacktest(id: string): Promise<boolean> {
    try {
      const result = await Backtest.findByIdAndDelete(id);
      return result !== null;
    } catch (error) {
      logger.error('Error deleting backtest:', error);
      throw error;
    }
  }
} 