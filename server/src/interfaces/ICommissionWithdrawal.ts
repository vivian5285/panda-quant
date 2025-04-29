import { Document } from 'mongoose';
import { Types } from 'mongoose';

export interface ICommissionWithdrawal extends Document {
  userId: Types.ObjectId;
  amount: number;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  paymentMethod: string;
  paymentDetails: Record<string, any>;
  adminComment?: string;
  createdAt: Date;
  updatedAt: Date;
} 