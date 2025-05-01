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
import { Document } from 'mongoose';
import { Types } from 'mongoose';
export interface IDeposit {
    id?: string;
    userId: string;
    amount: number;
    currency: string;
    status: 'pending' | 'completed' | 'failed';
    transactionId?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
export interface IDepositNotification extends Document {
    _id: Types.ObjectId;
    depositId: Types.ObjectId;
    userId: Types.ObjectId;
    type: 'email' | 'push' | 'sms';
    status: 'pending' | 'sent' | 'failed';
    sentAt?: Date;
    error?: string;
    createdAt: Date;
    updatedAt: Date;
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
