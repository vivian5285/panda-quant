import { Types } from 'mongoose';
import { OrderStatus } from './Enums';

export interface ICommission {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  amount: number;
  type: 'trade' | 'referral' | 'bonus';
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICommissionWithdrawal {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  amount: number;
  status: OrderStatus;
  walletAddress: string;
  createdAt: Date;
  updatedAt: Date;
} 