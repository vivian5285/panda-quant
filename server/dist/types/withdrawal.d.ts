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
import { Types, Document } from 'mongoose';
import { ICommissionWithdrawal } from './commissionWithdrawal';
import { WithdrawalStatus } from './enums';
export interface IWithdrawal {
    _id?: Types.ObjectId;
    userId: Types.ObjectId;
    amount: number;
    status: WithdrawalStatus;
    walletAddress: string;
    paymentMethod: 'crypto' | 'bank' | 'paypal';
    paymentDetails: Record<string, any>;
    adminComment?: string;
    createdAt?: Date;
    updatedAt?: Date;
    completedAt?: Date;
    metadata?: Record<string, any>;
}
export interface IWithdrawalDocument extends IWithdrawal, Document {
    _id: Types.ObjectId;
}
export type Withdrawal = IWithdrawalDocument;
export interface WithdrawalCreateInput extends Omit<ICommissionWithdrawal, '_id' | 'createdAt' | 'updatedAt'> {
}
export interface WithdrawalUpdateInput extends Partial<WithdrawalCreateInput> {
}
export interface WithdrawalNotification {
    userId: Types.ObjectId;
    amount: number;
    currency: string;
    network: string;
    address: string;
    transactionId: string;
    status: 'pending' | 'completed' | 'failed';
}
