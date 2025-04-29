import { Document } from 'mongoose';

export interface ICommissionWithdrawal extends Document {
  _id: string;
  userId: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  walletAddress: string;
  createdAt: Date;
  updatedAt: Date;
} 