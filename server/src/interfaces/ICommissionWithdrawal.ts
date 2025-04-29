import { Document, Types } from 'mongoose';

export interface ICommissionWithdrawal extends Document {
  userId: Types.ObjectId;
  amount: number;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  paymentMethod: string;
  paymentDetails: any;
  adminComment?: string;
  createdAt: Date;
  updatedAt: Date;
} 