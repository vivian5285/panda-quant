import { Types } from 'mongoose';

export interface ITransaction {
  _id?: Types.ObjectId;
  userId: Types.ObjectId;
  type: 'deposit' | 'withdrawal' | 'commission' | 'subscription';
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  referenceId: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

export type TransactionCreateInput = Omit<ITransaction, '_id' | 'createdAt' | 'updatedAt'>;
export type TransactionUpdateInput = Partial<TransactionCreateInput>; 