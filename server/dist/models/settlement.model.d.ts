import mongoose, { Document, Types } from 'mongoose';
export interface ISettlement {
    _id: Types.ObjectId;
    userId: Types.ObjectId;
    amount: number;
    currency: string;
    type: 'profit' | 'commission' | 'referral';
    status: 'pending' | 'processing' | 'completed' | 'failed';
    description: string;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
export interface ISettlementDocument extends Document {
    _id: Types.ObjectId;
    userId: Types.ObjectId;
    amount: number;
    currency: string;
    type: 'profit' | 'commission' | 'referral';
    status: 'pending' | 'processing' | 'completed' | 'failed';
    description: string;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
export declare const Settlement: mongoose.Model<ISettlementDocument, {}, {}, {}, mongoose.Document<unknown, {}, ISettlementDocument, {}> & ISettlementDocument & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default Settlement;
//# sourceMappingURL=settlement.model.d.ts.map