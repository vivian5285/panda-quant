import { Types } from 'mongoose';

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

export type DepositCreateInput = Omit<IDeposit, '_id' | 'createdAt' | 'updatedAt'>;
export type DepositUpdateInput = Partial<DepositCreateInput>;

export interface DepositNotification {
  userId: Types.ObjectId;
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