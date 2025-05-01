import { Document } from 'mongoose';
import { Types } from 'mongoose';

export interface IDeposit {
  id?: string;
  userId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  transactionId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IDepositNotification extends Document {
  _id: Types.ObjectId;
  depositId: Types.ObjectId;
  userId: Types.ObjectId;
  type: 'email' | 'push' | 'sms';
  status: 'pending' | 'sent' | 'failed';
  sentAt?: Date;
  error?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IDepositStats {
  totalDeposits: number;
  totalAmount: number;
  pendingDeposits: number;
  completedDeposits: number;
  failedDeposits: number;
  monthlyStats: {
    month: string;
    deposits: number;
    amount: number;
  }[];
  methodStats: {
    method: string;
    deposits: number;
    amount: number;
  }[];
  userStats: {
    userId: Types.ObjectId;
    deposits: number;
    amount: number;
  }[];
}

export type Deposit = IDeposit;

export interface DepositCreateInput extends Omit<IDeposit, '_id' | 'createdAt' | 'updatedAt'> {}
export interface DepositUpdateInput extends Partial<DepositCreateInput> {}

export interface DepositNotification {
  userId: string;
  amount: number;
  currency: string;
  network: string;
  address: string;
  transactionId: string;
  status: 'pending' | 'completed' | 'failed';
}

export interface LargeDepositAlert {
  type: 'large_deposit';
  message: string;
  data: Deposit;
} 