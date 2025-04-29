import { Types } from 'mongoose';

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

export type WithdrawalCreateInput = Omit<IWithdrawal, '_id' | 'createdAt' | 'updatedAt'>;
export type WithdrawalUpdateInput = Partial<WithdrawalCreateInput>;

export interface WithdrawalNotification {
  userId: Types.ObjectId;
  amount: number;
  currency: string;
  network: string;
  address: string;
  transactionId: string;
  status: 'pending' | 'completed' | 'failed';
} 