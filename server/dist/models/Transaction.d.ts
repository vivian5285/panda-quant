import mongoose, { Document } from 'mongoose';
import { Types } from 'mongoose';
export interface ITransaction extends Document {
    userId: Types.ObjectId;
    type: 'deposit' | 'withdrawal' | 'commission' | 'refund';
    amount: number;
    currency: string;
    status: 'pending' | 'completed' | 'failed';
    referenceId: Types.ObjectId;
    referenceType: 'Deposit' | 'Withdrawal' | 'CommissionRecord';
    description?: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare const Transaction: mongoose.Model<ITransaction, {}, {}, {}, mongoose.Document<unknown, {}, ITransaction, {}> & ITransaction & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
