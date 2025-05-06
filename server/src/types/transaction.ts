import { Document, Types } from 'mongoose';

export interface ITransaction {
  userId: Types.ObjectId;
  type: 'deposit' | 'withdrawal' | 'trade' | 'commission';
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  referenceId: Types.ObjectId;
  referenceType: 'Deposit' | 'Withdrawal' | 'CommissionRecord';
  description?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITransactionDocument extends Omit<ITransaction, '_id'>, Document {
  _id: Types.ObjectId;
}

export type Transaction = ITransaction;

export interface TransactionCreateInput extends Omit<ITransaction, '_id' | 'createdAt' | 'updatedAt'> {}
export interface TransactionUpdateInput extends Partial<TransactionCreateInput> {} 