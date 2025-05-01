import { Schema, Document } from 'mongoose';
import { CommissionStatus, CommissionType } from '../types/enums';
export interface ICommission extends Document {
    userId: Schema.Types.ObjectId;
    amount: number;
    type: CommissionType;
    status: CommissionStatus;
    description?: string;
    referenceId?: string;
    referenceType?: string;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
export declare const Commission: import("mongoose").Model<ICommission, {}, {}, {}, Document<unknown, {}, ICommission, {}> & ICommission & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
