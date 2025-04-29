import { Types } from 'mongoose';
import { ICommissionWithdrawal } from '../interfaces/ICommissionWithdrawal';

export type Withdrawal = ICommissionWithdrawal;

export interface IWithdrawal {
  _id?: Types.ObjectId;
  userId: Types.ObjectId;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  network: string;
  address: string;
  transactionId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

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