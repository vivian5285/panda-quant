import { Types } from 'mongoose';
import { Backtest } from '../models/Backtest';
import { logger } from '../utils/logger';
import { IBacktest, IBacktestDocument } from '../types/Backtest';

export class BacktestService {
  async createBacktest(data: Omit<IBacktest, '_id' | 'createdAt' | 'updatedAt'>): Promise<IBacktest> {
    try {
      const backtest = new Backtest(data);
      const savedBacktest = await backtest.save();
      return savedBacktest.toObject();
    } catch (error) {
      logger.error('Error creating backtest:', error);
      throw error;
    }
  }

  async getBacktestById(id: string): Promise<IBacktest | null> {
    try {
      const backtest = await Backtest.findById(id);
      if (!backtest) return null;
      return backtest.toObject();
    } catch (error) {
      logger.error('Error getting backtest:', error);
      throw error;
    }
  }

  async getBacktestsByStrategyId(strategyId: string): Promise<IBacktest[]> {
    try {
      const backtests = await Backtest.find({ strategyId });
      return backtests.map(backtest => backtest.toObject());
    } catch (error) {
      logger.error('Error getting backtests:', error);
      throw error;
    }
  }

  async updateBacktest(id: string, data: Partial<IBacktest>): Promise<IBacktest | null> {
    try {
      const backtest = await Backtest.findByIdAndUpdate(id, data, { new: true });
      if (!backtest) return null;
      return backtest.toObject();
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