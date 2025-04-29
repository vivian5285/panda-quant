import { Types } from 'mongoose';

export interface ICommission {
  userId: Types.ObjectId;
  referrerId: Types.ObjectId;
  amount: number;
  rate: number;
  commission: number;
  status: 'pending' | 'paid' | 'cancelled';
  type: 'direct' | 'indirect';
  createdAt: Date;
  updatedAt: Date;
} 