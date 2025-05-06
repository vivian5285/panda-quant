import { Document, Types } from 'mongoose';
import { StrategyType, StrategyStatus } from './Enums';
import { IPerformanceMetrics } from './Performance';

export interface IStrategyPerformanceMetrics {
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  winRate: number;
  profitFactor: number;
  averageWin: number;
  averageLoss: number;
  maxDrawdown: number;
  sharpeRatio: number;
  sortinoRatio: number;
  totalProfit: number;
  monthlyReturns: number[];
  dailyReturns: number[];
}

export interface IStrategy {
  userId: Types.ObjectId;
  name: string;
  description: string;
  type: string;
  status: 'active' | 'inactive' | 'pending';
  parameters: Record<string, any>;
  performance?: {
    totalTrades: number;
    winRate: number;
    profit: number;
    metrics: Record<string, any>;
  };
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface IStrategyDocument extends Omit<IStrategy, '_id'>, Document {
  _id: Types.ObjectId;
}

export type Strategy = IStrategy;

export interface StrategyCreateInput extends Omit<IStrategy, '_id' | 'createdAt' | 'updatedAt'> {}
export interface StrategyUpdateInput extends Partial<StrategyCreateInput> {}

export interface IStrategyPerformance {
  strategyId: string;
  userId: string;
  period: {
    start: Date;
    end: Date;
  };
  metrics: {
    totalProfit: number;
    largestLoss: number;
    winRate: number;
    averageWin: number;
    averageLoss: number;
  };
  trades: {
    entryTime: Date;
    exitTime: Date;
    entryPrice: number;
    exitPrice: number;
    size: number;
    profit: number;
    type: 'long' | 'short';
    status: 'win' | 'loss';
  }[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IStrategyPerformanceDocument extends IStrategyPerformance, Document {}

export interface IStrategyRating {
  strategyId: string;
  userId: string;
  rating: number;
  comment?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IStrategyRatingDocument extends IStrategyRating, Document {}

export interface IStrategyBacktest {
  strategyId: string;
  userId: string;
  period: {
    start: Date;
    end: Date;
  };
  settings: {
    initialBalance: number;
    riskPerTrade: number;
    maxDrawdown: number;
    maxDailyLoss: number;
    maxPositionSize: number;
    leverage: number;
    stopLoss: number;
    takeProfit: number;
    timeframes: string[];
    pairs: string[];
  };
  results: IPerformanceMetrics & {
    finalBalance: number;
    return: number;
    annualizedReturn: number;
    volatility: number;
  };
  trades: {
    entryTime: Date;
    exitTime: Date;
    entryPrice: number;
    exitPrice: number;
    size: number;
    profit: number;
    type: 'long' | 'short';
    status: 'win' | 'loss';
  }[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IStrategyBacktestDocument extends IStrategyBacktest, Document {}

export { StrategyType, StrategyStatus }; 