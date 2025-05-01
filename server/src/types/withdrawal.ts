import { Types, Document } from 'mongoose';
import { ICommissionWithdrawal } from './commissionWithdrawal';
import { WithdrawalStatus } from './enums';

export interface IWithdrawal {
  _id?: Types.ObjectId;
  userId: Types.ObjectId;
  amount: number;
  status: WithdrawalStatus;
  walletAddress: string;
  paymentMethod: 'crypto' | 'bank' | 'paypal';
  paymentDetails: Record<string, any>;
  adminComment?: string;
  createdAt?: Date;
  updatedAt?: Date;
  completedAt?: Date;
  metadata?: Record<string, any>;
}

export interface IWithdrawalDocument extends IWithdrawal, Document {
  _id: Types.ObjectId;
}

export type Withdrawal = IWithdrawalDocument;

export interface WithdrawalCreateInput extends Omit<ICommissionWithdrawal, '_id' | 'createdAt' | 'updatedAt'> {}
export interface WithdrawalUpdateInput extends Partial<WithdrawalCreateInput> {}

export interface WithdrawalNotification {
  userId: Types.ObjectId;
  amount: number;
  currency: string;
  network: string;
  address: string;
  transactionId: string;
  status: 'pending' | 'completed' | 'failed';
} 