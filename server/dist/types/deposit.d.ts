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
export interface IDeposit {
    userId: Types.ObjectId;
    amount: number;
    currency: string;
    status: 'pending' | 'completed' | 'failed';
    transactionId?: string;
    network: string;
    address: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface IDepositDocument extends Omit<IDeposit, '_id'>, Document {
    _id: Types.ObjectId;
}
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
export interface DepositCreateInput extends Omit<IDeposit, '_id' | 'createdAt' | 'updatedAt'> {
}
export interface DepositUpdateInput extends Partial<DepositCreateInput> {
}
export interface LargeDepositAlert {
    type: 'large_deposit';
    message: string;
    data: Deposit;
}
//# sourceMappingURL=Deposit.d.ts.map