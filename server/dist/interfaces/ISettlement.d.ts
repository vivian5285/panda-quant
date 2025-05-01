import { Document } from 'mongoose';
import { Types } from 'mongoose';
export interface SettlementMetadata {
    platformShare: number;
    level1Share: number;
    level2Share: number;
    commissionIds?: Types.ObjectId[];
}
export interface ISettlement {
    _id?: Types.ObjectId;
    userId: Types.ObjectId;
    amount: number;
    status: 'pending' | 'completed' | 'failed';
    type: 'commission' | 'bonus' | 'referral';
    createdAt: Date;
    updatedAt: Date;
    metadata?: SettlementMetadata;
    level1UserId?: Types.ObjectId;
    level2UserId?: Types.ObjectId;
}
export interface ISettlementDocument extends Omit<ISettlement, '_id'>, Document {
    save(): Promise<this>;
}
