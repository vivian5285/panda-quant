/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose/types/inferschematype" />
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
export interface TransactionCreateInput extends Omit<ITransaction, '_id' | 'createdAt' | 'updatedAt'> {
}
export interface TransactionUpdateInput extends Partial<TransactionCreateInput> {
}
//# sourceMappingURL=Transaction.d.ts.map