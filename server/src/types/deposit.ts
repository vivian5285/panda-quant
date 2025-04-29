import { Types } from 'mongoose';
import { IDeposit } from '../interfaces/IDeposit';

export type Deposit = IDeposit;

export interface IDeposit {
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