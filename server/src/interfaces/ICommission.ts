import { Document } from 'mongoose';

export interface ICommission extends Document {
  userId: string | null;
  fromUserId: string;
  amount: number;
  level: number;
  strategyId: string;
  performanceId: string;
  status: 'pending' | 'paid';
  createdAt: Date;
  updatedAt: Date;
} 