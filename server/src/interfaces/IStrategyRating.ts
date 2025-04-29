import { Document, Types } from 'mongoose';

export interface IStrategyRating extends Document {
  userId: Types.ObjectId;
  strategyId: Types.ObjectId;
  rating: number;
  comment?: string;
  createdAt: Date;
  updatedAt: Date;
} 