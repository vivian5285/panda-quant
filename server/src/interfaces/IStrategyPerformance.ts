import { Document, Types } from 'mongoose';

export interface IStrategyPerformance extends Document {
  userId: Types.ObjectId;
  strategyId: Types.ObjectId;
  profit: number;
  createdAt: Date;
} 