import { Document } from 'mongoose';

export interface IStrategyPerformance extends Document {
  _id: string;
  strategyId: string;
  userId: string;
  performance: {
    totalReturn: number;
    dailyReturn: number;
    sharpeRatio: number;
    maxDrawdown: number;
  };
  createdAt: Date;
  updatedAt: Date;
} 