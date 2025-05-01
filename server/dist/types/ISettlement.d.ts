import { Document, Types } from 'mongoose';
export declare enum SettlementType {
    DEPOSIT = "deposit",
    WITHDRAW = "withdraw"
}
export declare enum SettlementStatus {
    PENDING = "pending",
    COMPLETED = "completed",
    FAILED = "failed",
    CANCELLED = "cancelled"
}
export interface ISettlement {
    userId: Types.ObjectId;
    type: SettlementType;
    amount: number;
    status: SettlementStatus;
    description?: string;
    metadata?: Record<string, any>;
    completedAt?: Date;
    failedAt?: Date;
    cancelledAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
export interface ISettlementDocument extends Omit<ISettlement, '_id'>, Document {
    _id: Types.ObjectId;
}
