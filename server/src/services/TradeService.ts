import { Types } from 'mongoose';
import { Trade } from '../models/Trade.model';
import { ITrade, ITradeDocument } from '../types/Trade';
import { logger } from '../utils/Logger';
import { AppError } from '../utils/AppError';

export class TradeService {
  private static instance: TradeService;

  private constructor() {}

  public static getInstance(): TradeService {
    if (!TradeService.instance) {
      TradeService.instance = new TradeService();
    }
    return TradeService.instance;
  }

  async createTrade(tradeData: Omit<ITrade, '_id'>): Promise<ITrade> {
    try {
      const trade = new Trade(tradeData);
      const savedTrade = await trade.save();
      return this.convertToITrade(savedTrade);
    } catch (error) {
      logger.error('Error creating trade:', error);
      throw error;
    }
  }

  async getTradeById(id: string): Promise<ITrade | null> {
    try {
      const trade = await Trade.findById(id);
      return trade ? this.convertToITrade(trade) : null;
    } catch (error) {
      logger.error('Error getting trade:', error);
      throw error;
    }
  }

  async getTradesByUserId(userId: string): Promise<ITrade[]> {
    try {
      const trades = await Trade.find({ userId: new Types.ObjectId(userId) });
      return trades.map(trade => this.convertToITrade(trade));
    } catch (error) {
      logger.error('Error getting trades:', error);
      throw error;
    }
  }

  async getTradesByStrategyId(strategyId: string): Promise<ITrade[]> {
    try {
      const trades = await Trade.find({ strategyId: new Types.ObjectId(strategyId) });
      return trades.map(trade => this.convertToITrade(trade));
    } catch (error) {
      logger.error('Error getting trades:', error);
      throw error;
    }
  }

  async updateTradeStatus(id: string, status: 'OPEN' | 'CLOSED', exitPrice?: number): Promise<ITrade | null> {
    try {
      const updateData: any = { status };
      if (exitPrice) {
        updateData.exitPrice = exitPrice;
      }
      const trade = await Trade.findByIdAndUpdate(id, updateData, { new: true });
      return trade ? this.convertToITrade(trade) : null;
    } catch (error) {
      logger.error('Error updating trade status:', error);
      throw new AppError('Failed to update trade status', 500);
    }
  }

  async getTradeHistory(userId: string, startDate: Date, endDate: Date): Promise<ITrade[]> {
    try {
      const trades = await Trade.find({
        userId: new Types.ObjectId(userId),
        createdAt: {
          $gte: startDate,
          $lte: endDate
        }
      }).sort({ createdAt: -1 });
      return trades.map(trade => this.convertToITrade(trade));
    } catch (error) {
      logger.error('Error getting trade history:', error);
      throw new AppError('Failed to get trade history', 500);
    }
  }

  async calculateTradeMetrics(trades: ITrade[]): Promise<{
    totalTrades: number;
    winningTrades: number;
    losingTrades: number;
    winRate: number;
    averageProfit: number;
    averageLoss: number;
    profitFactor: number;
    totalProfit: number;
  }> {
    try {
      const metrics = {
        totalTrades: trades.length,
        winningTrades: 0,
        losingTrades: 0,
        winRate: 0,
        averageProfit: 0,
        averageLoss: 0,
        profitFactor: 0,
        totalProfit: 0
      };

      if (trades.length === 0) {
        return metrics;
      }

      const winningTrades = trades.filter(trade => (trade.profit || 0) > 0);
      const losingTrades = trades.filter(trade => (trade.profit || 0) < 0);

      metrics.winningTrades = winningTrades.length;
      metrics.losingTrades = losingTrades.length;
      metrics.winRate = (winningTrades.length / trades.length) * 100;

      if (winningTrades.length > 0) {
        metrics.averageProfit = winningTrades.reduce((sum, trade) => sum + (trade.profit || 0), 0) / winningTrades.length;
      }

      if (losingTrades.length > 0) {
        metrics.averageLoss = Math.abs(losingTrades.reduce((sum, trade) => sum + (trade.profit || 0), 0) / losingTrades.length);
      }

      const totalProfit = winningTrades.reduce((sum, trade) => sum + (trade.profit || 0), 0);
      const totalLoss = Math.abs(losingTrades.reduce((sum, trade) => sum + (trade.profit || 0), 0));

      metrics.profitFactor = totalLoss === 0 ? totalProfit : totalProfit / totalLoss;
      metrics.totalProfit = totalProfit - totalLoss;

      return metrics;
    } catch (error) {
      logger.error('Error calculating trade metrics:', error);
      throw new AppError('Failed to calculate trade metrics', 500);
    }
  }

  private convertToITrade(trade: ITradeDocument): ITrade {
    return {
      _id: trade._id,
      userId: trade.userId,
      strategyId: trade.strategyId,
      symbol: trade.symbol,
      type: trade.type,
      side: trade.side,
      amount: trade.amount,
      price: trade.price,
      status: trade.status,
      profit: trade.profit,
      createdAt: trade.createdAt,
      updatedAt: trade.updatedAt
    };
  }
}

export const tradeService = TradeService.getInstance(); 