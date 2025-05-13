import { Types } from 'mongoose';
import { StrategyType, StrategyStatus } from './Enums';

export interface StrategyParameters {
  userId: string;
  symbol: string;
  amount: number;
  leverage: number;
  maxDrawdown: number;
}

export enum StrategyStatus {
  RUNNING = 'running',
  PAUSED = 'paused',
  STOPPED = 'stopped',
  FAILED = 'failed'
}

export interface IStrategy {
  _id: Types.ObjectId;
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
  performance?: {
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
  };
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
} 