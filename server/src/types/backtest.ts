import { Document } from 'mongoose';

export interface IBacktest extends Document {
  _id: string;
  userId: string;
  strategyId: string;
  exchange: string;
  symbol: string;
  timeframe: string;
  startTime: Date;
  endTime: Date;
  initialBalance: number;
  finalBalance: number;
  totalReturn: number;
  maxDrawdown: number;
  sharpeRatio: number;
  winRate: number;
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  averageWin: number;
  averageLoss: number;
  parameters: Record<string, any>;
  results: {
    trades: Array<{
      entryTime: Date;
      exitTime: Date;
      entryPrice: number;
      exitPrice: number;
      side: 'long' | 'short';
      amount: number;
      pnl: number;
    }>;
    equity: Array<{
      time: Date;
      value: number;
    }>;
  };
  status: 'pending' | 'running' | 'completed' | 'failed';
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  error?: string;
  metadata?: Record<string, any>;
} 