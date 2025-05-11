import { Document, Types } from 'mongoose';
import { CommissionStatus } from './Enums';

export interface ICommissionWithdrawal {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  amount: number;
  currency: string;
  status: CommissionStatus;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  transactionId?: string;
  notes?: string;
}

export interface ICommissionWithdrawalDocument extends Document, Omit<ICommissionWithdrawal, '_id'> {
  _id: Types.ObjectId;
} 