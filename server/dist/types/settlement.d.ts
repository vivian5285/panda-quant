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
import { SettlementType } from './Enums';
export declare enum SettlementStatus {
    PENDING = "pending",
    PROCESSING = "processing",
    COMPLETED = "completed",
    FAILED = "failed",
    CANCELLED = "cancelled"
}
export interface ISettlementBase {
    userId: Types.ObjectId;
    amount: number;
    type: SettlementType;
    status: SettlementStatus;
    referenceId: Types.ObjectId;
    referenceType: string;
    description?: string;
    metadata?: Record<string, any>;
    completedAt?: Date;
    createdAt?: Date;
    updatedAt?: Date;
}
export interface ISettlement extends ISettlementBase {
    _id: Types.ObjectId;
}
export interface ISettlementDocument extends ISettlement, Document {
    _id: Types.ObjectId;
}
export interface SettlementMetadata {
    commissionIds?: Types.ObjectId[];
    platformShare?: number;
    level1Share?: number;
    level2Share?: number;
    [key: string]: any;
}
export interface SettlementFilter {
    startDate?: Date;
    endDate?: Date;
    userId?: Types.ObjectId;
    status?: SettlementStatus | 'all';
}
export interface SettlementResponse {
    settlements: ISettlementDocument[];
    total: number;
}
export interface SettlementSummary {
    totalAmount: number;
    totalCount: number;
    pendingCount: number;
    completedCount: number;
    failedCount: number;
    platformTotal: number;
    level1Total: number;
    level2Total: number;
}
export type Settlement = ISettlement;
export interface SettlementCreateInput extends Omit<ISettlementBase, 'createdAt' | 'updatedAt'> {
}
export interface SettlementUpdateInput extends Partial<SettlementCreateInput> {
}
//# sourceMappingURL=Settlement.d.ts.map