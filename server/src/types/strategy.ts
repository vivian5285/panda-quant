import type { Document, Types } from 'mongoose';
import type { StrategyType, StrategyStatus } from './Enums';
import type { PerformanceMetrics } from './Performance';

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

export type StrategyPerformanceMetrics = IStrategyPerformanceMetrics;

export interface IStrategyBase {
  userId: Types.ObjectId;
  name: string;
  description: string;
  type: StrategyType;
  status: StrategyStatus;
  config: {
    exchange: string;
    symbol: string;
    timeframe: string;
    parameters: Record<string, any>;
    riskManagement: {
      maxPositionSize: number;
      stopLoss: number;
      takeProfit: number;
      trailingStop: number;
      maxDrawdown: number;
      maxOpenTrades: number;
    };
    filters: {
      minVolume: number;
      minVolatility: number;
      maxSpread: number;
      allowedSymbols: string[];
      excludedSymbols: string[];
    };
    notifications: {
      email: boolean;
      telegram: boolean;
      webhook: boolean;
    };
  };
  performance?: PerformanceMetrics;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export type StrategyBase = IStrategyBase;

export interface IStrategy extends Document {
  userId: Types.ObjectId;
  name: string;
  description: string;
  type: StrategyType;
  status: StrategyStatus;
  config: {
    exchange: string;
    symbol: string;
    timeframe: string;
    parameters: Record<string, any>;
    riskManagement: {
      maxPositionSize: number;
      stopLoss: number;
      takeProfit: number;
      trailingStop: number;
      maxDrawdown: number;
      maxOpenTrades: number;
    };
    filters: {
      minVolume: number;
      minVolatility: number;
      maxSpread: number;
      allowedSymbols: string[];
      excludedSymbols: string[];
    };
    notifications: {
      email: boolean;
      telegram: boolean;
      webhook: boolean;
    };
  };
  performance?: PerformanceMetrics;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export type Strategy = IStrategy;

export type IStrategyDocument = IStrategy;
export type StrategyDocument = Strategy;

export interface IStrategyCreateInput extends Omit<IStrategyBase, 'createdAt' | 'updatedAt'> {}
export type StrategyCreateInput = IStrategyCreateInput;

export interface IStrategyUpdateInput extends Partial<IStrategyCreateInput> {}
export type StrategyUpdateInput = IStrategyUpdateInput;

export interface StrategyPerformanceBase {
  strategyId: Types.ObjectId;
  userId: Types.ObjectId;
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

export interface StrategyPerformance extends Document, StrategyPerformanceBase {}

export type StrategyPerformanceDocument = StrategyPerformance;

export interface StrategyRatingBase {
  strategyId: Types.ObjectId;
  userId: Types.ObjectId;
  rating: number;
  comment?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface StrategyRating extends Document, StrategyRatingBase {}

export type StrategyRatingDocument = StrategyRating;

export interface StrategyBacktest {
  strategyId: Types.ObjectId;
  userId: Types.ObjectId;
  startDate: Date;
  endDate: Date;
  initialCapital: number;
  performance: PerformanceMetrics;
  trades: {
    entryTime: Date;
    exitTime: Date;
    symbol: string;
    side: 'buy' | 'sell';
    entryPrice: number;
    exitPrice: number;
    quantity: number;
    pnl: number;
    pnlPercentage: number;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

export interface StrategyOptimization {
  strategyId: Types.ObjectId;
  userId: Types.ObjectId;
  startDate: Date;
  endDate: Date;
  parameters: {
    name: string;
    min: number;
    max: number;
    step: number;
  }[];
  results: {
    parameters: Record<string, any>;
    performance: PerformanceMetrics;
  }[];
  bestResult: {
    parameters: Record<string, any>;
    performance: PerformanceMetrics;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface StrategyMonitor {
  strategyId: Types.ObjectId;
  userId: Types.ObjectId;
  status: 'active' | 'paused' | 'stopped';
  lastCheck: Date;
  lastTrade: Date;
  currentPositions: {
    symbol: string;
    side: 'long' | 'short';
    entryPrice: number;
    quantity: number;
    currentPrice: number;
    pnl: number;
    pnlPercentage: number;
  }[];
  alerts: {
    type: string;
    message: string;
    level: 'info' | 'warning' | 'error';
    timestamp: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

export type StrategyBacktestDocument = StrategyBacktest;

export { StrategyType, StrategyStatus }; 