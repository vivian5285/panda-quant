import { Document } from 'mongoose';
export interface ICommissionRecordDocument extends Document {
    userId: string;
    amount: number;
    type: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare const CommissionRecord: import("mongoose").Model<ICommissionRecordDocument, {}, {}, {}, Document<unknown, {}, ICommissionRecordDocument, {}> & ICommissionRecordDocument & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default CommissionRecord;
//# sourceMappingURL=CommissionRecord.d.ts.map