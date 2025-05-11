import { Document, Types } from 'mongoose';

export interface IDepositBase {
  userId: Types.ObjectId;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  createdAt: Date;
  updatedAt: Date;
}

export interface IDeposit extends IDepositBase {
  _id: Types.ObjectId;
}

export interface IDepositDocument extends Omit<Document, '_id'>, IDeposit {}

export type DepositCreateInput = Omit<IDepositBase, 'createdAt' | 'updatedAt'>;
export type DepositUpdateInput = Partial<Omit<IDepositBase, 'createdAt' | 'updatedAt'>>;

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

export interface LargeDepositAlert {
  type: 'large_deposit';
  message: string;
  data: Deposit;
} 