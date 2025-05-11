import { Document, Types } from 'mongoose';
import { StrategyType, StrategyStatus } from './Enums';
import { PerformanceMetrics } from './Performance';

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

export interface IStrategyConfig {
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
}

export interface IStrategyBase {
  userId: Types.ObjectId;
  name: string;
  description: string;
  type: StrategyType;
  status: StrategyStatus;
  config: IStrategyConfig;
  performance?: IStrategyPerformanceMetrics;
  metadata?: {
    history?: {
      timestamp: Date;
      action: string;
      details: Record<string, any>;
    }[];
    tags?: string[];
    category?: string;
    version?: string;
    lastUpdated?: Date;
  };
}

export interface IStrategy extends IStrategyBase {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface IStrategyDocument extends Omit<Document, '_id'>, IStrategy {}

export type StrategyCreateInput = Omit<IStrategyBase, 'performance'>;
export type StrategyUpdateInput = Partial<StrategyCreateInput>;

export interface IStrategyRating {
  _id: Types.ObjectId;
  strategyId: Types.ObjectId;
  userId: Types.ObjectId;
  rating: number;
  comment?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IStrategyRatingDocument extends Document, Omit<IStrategyRating, '_id'> {
  _id: Types.ObjectId;
}

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

export interface StrategyPerformance extends Document, Omit<StrategyPerformanceBase, '_id'> {
  _id: Types.ObjectId;
}

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

export { StrategyType, StrategyStatus }; 