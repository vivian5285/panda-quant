import { Document, Types } from 'mongoose';
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
    type: string;
    status: 'pending' | 'completed' | 'failed';
    referenceId: Types.ObjectId;
    referenceType: string;
    description?: string;
    metadata?: Record<string, any>;
    completedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
export interface ISettlement extends ISettlementBase {
    _id: Types.ObjectId;
}
export interface ISettlementDocument extends ISettlementBase, Document {
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
    userId?: string;
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