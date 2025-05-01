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
import { Types } from 'mongoose';
import { WithdrawalStatus } from '../types/enums';
import { IWithdrawal, IWithdrawalDocument } from '../types/withdrawal';
export declare class WithdrawalService {
    private withdrawalModel;
    constructor();
    createWithdrawal(data: Partial<IWithdrawal>): Promise<IWithdrawalDocument>;
    getWithdrawals(userId: string): Promise<IWithdrawalDocument[]>;
    getWithdrawal(id: string, userId: string): Promise<IWithdrawalDocument | null>;
    updateWithdrawal(id: string, userId: string, data: Partial<IWithdrawal>): Promise<IWithdrawalDocument | null>;
    deleteWithdrawal(id: string, userId: string): Promise<IWithdrawalDocument | null>;
    getWithdrawalsByStatus(userId: string, status: WithdrawalStatus): Promise<IWithdrawalDocument[]>;
    getWithdrawalsByPaymentMethod(userId: string, paymentMethod: string): Promise<IWithdrawalDocument[]>;
    getWithdrawalStats(userId: string): Promise<{
        totalWithdrawals: number;
        totalAmount: number;
        pendingWithdrawals: number;
    }>;
    cancelWithdrawal(data: {
        _id: Types.ObjectId;
        status: string;
    }): Promise<IWithdrawalDocument | null>;
}
