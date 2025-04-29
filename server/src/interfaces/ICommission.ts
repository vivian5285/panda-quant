import { Document, Types } from 'mongoose';

export interface ICommission extends Document {
  userId: Types.ObjectId;
  fromUserId: Types.ObjectId;
  amount: number;
  level: number;
  strategyId: Types.ObjectId;
  performanceId: Types.ObjectId;
  status: 'pending' | 'paid';
  createdAt: Date;
  updatedAt: Date;
} 