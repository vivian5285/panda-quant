import { Document } from 'mongoose';

export interface IDeposit extends Document {
  _id: string;
  userId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  txHash: string;
  timestamp: Date;
  createdAt: Date;
  updatedAt: Date;
} 