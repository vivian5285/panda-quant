import { Document } from 'mongoose';

export interface ICommission extends Document {
  _id: string;
  userId: string;
  amount: number;
  type: 'trade' | 'referral';
  status: 'pending' | 'paid';
  createdAt: Date;
  updatedAt: Date;
} 