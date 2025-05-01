import { Types } from 'mongoose';
export interface ITransaction {
    _id?: Types.ObjectId;
    userId: Types.ObjectId;
    type: 'deposit' | 'withdrawal' | 'commission' | 'subscription' | 'transfer' | 'trade' | 'fee';
    amount: number;
    currency: string;
    status: 'pending' | 'completed' | 'failed' | 'processing';
    referenceId?: Types.ObjectId;
    description?: string;
    metadata?: Record<string, any>;
    createdAt?: Date;
    updatedAt?: Date;
}
export type TransactionCreateInput = Omit<ITransaction, '_id' | 'createdAt' | 'updatedAt'>;
export type TransactionUpdateInput = Partial<TransactionCreateInput>;
