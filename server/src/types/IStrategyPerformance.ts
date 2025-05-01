import { Document, Types } from 'mongoose';

export interface IStrategyPerformance {
  strategyId: Types.ObjectId;
  userId: Types.ObjectId;
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  winRate: number;
  averageProfit: number;
  averageLoss: number;
  profitFactor: number;
  totalProfit: number;
  totalLoss: number;
  netProfit: number;
  maxDrawdown: number;
  sharpeRatio: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IStrategyPerformanceDocument extends IStrategyPerformance, Document {} 