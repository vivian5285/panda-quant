import { Types } from 'mongoose';

export interface IBacktest {
  _id?: Types.ObjectId;
  strategyId: Types.ObjectId;
  userId: Types.ObjectId;
  startDate: Date;
  endDate: Date;
  initialCapital: number;
  finalCapital: number;
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  winRate: number;
  profitFactor: number;
  maxDrawdown: number;
  sharpeRatio: number;
  status: 'pending' | 'completed' | 'failed';
  parameters: Map<string, any>;
  results: Record<string, any>;
  createdAt: Date;
  updatedAt?: Date;
} 