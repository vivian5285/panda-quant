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
/// <reference types="@/types/mongoose" />
import { Document, Types } from 'mongoose';
export interface IWithdrawal {
    userId: Types.ObjectId;
    amount: number;
    currency: string;
    status: 'pending' | 'completed' | 'failed';
    network: string;
    address: string;
    transactionId?: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface IWithdrawalDocument extends Omit<IWithdrawal, '_id'>, Document {
    _id: Types.ObjectId;
}
export type Withdrawal = IWithdrawal;
export interface WithdrawalCreateInput extends Omit<IWithdrawal, '_id' | 'createdAt' | 'updatedAt'> {
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
