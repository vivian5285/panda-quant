import { Document } from 'mongoose';
import { Types } from 'mongoose';

export interface IStrategy extends Document {
  _id: Types.ObjectId;
  name: string;
  description: string;
  type: 'manual' | 'automated';
  status: 'active' | 'inactive' | 'testing';
  userId: Types.ObjectId;
  settings: {
    riskLevel: 'low' | 'medium' | 'high';
    maxDrawdown: number;
    maxDailyLoss: number;
    maxPositionSize: number;
    leverage: number;
    stopLoss: number;
    takeProfit: number;
    timeframes: string[];
    pairs: string[];
  };
  performance: {
    totalTrades: number;
    winRate: number;
    profitFactor: number;
    averageTradeDuration: number;
    totalProfit: number;
    maxDrawdown: number;
    sharpeRatio: number;
    sortinoRatio: number;
    lastUpdated: Date;
  };
  createdAt: Date;
  updatedAt: Date;
  lastActive?: Date;
  metadata?: {
    version?: string;
    lastBacktest?: Date;
    lastOptimization?: Date;
    tags?: string[];
  };
}

export interface IStrategyPerformance extends Document {
  _id: Types.ObjectId;
  strategyId: Types.ObjectId;
  userId: Types.ObjectId;
  period: {
    start: Date;
    end: Date;
  };
  metrics: {
    totalTrades: number;
    winningTrades: number;
    losingTrades: number;
    winRate: number;
    profitFactor: number;
    averageTradeDuration: number;
    totalProfit: number;
    maxDrawdown: number;
    sharpeRatio: number;
    sortinoRatio: number;
    averageWin: number;
    averageLoss: number;
    largestWin: number;
    largestLoss: number;
    consecutiveWins: number;
    consecutiveLosses: number;
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

export interface IStrategyRating extends Document {
  _id: Types.ObjectId;
  strategyId: Types.ObjectId;
  userId: Types.ObjectId;
  rating: number;
  comment?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IStrategyBacktest extends Document {
  _id: Types.ObjectId;
  strategyId: Types.ObjectId;
  userId: Types.ObjectId;
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
  results: {
    totalTrades: number;
    winningTrades: number;
    losingTrades: number;
    winRate: number;
    profitFactor: number;
    averageTradeDuration: number;
    totalProfit: number;
    maxDrawdown: number;
    sharpeRatio: number;
    sortinoRatio: number;
    averageWin: number;
    averageLoss: number;
    largestWin: number;
    largestLoss: number;
    consecutiveWins: number;
    consecutiveLosses: number;
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