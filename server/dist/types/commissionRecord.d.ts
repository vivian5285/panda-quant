import { Types, Document } from 'mongoose';
export interface ICommissionRecord extends Document {
    _id: Types.ObjectId;
    userId: Types.ObjectId;
    commissionId: Types.ObjectId;
    amount: number;
    status: 'pending' | 'paid' | 'cancelled';
    createdAt: Date;
    updatedAt: Date;
}
//# sourceMappingURL=CommissionRecord.d.ts.map