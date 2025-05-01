import mongoose, { Document } from 'mongoose';
import { Types } from 'mongoose';
export interface IDeposit extends Document {
    userId: Types.ObjectId;
    amount: number;
    currency: string;
    status: 'pending' | 'completed' | 'failed';
    transactionId: string;
    network: string;
    address: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare const Deposit: mongoose.Model<IDeposit, {}, {}, {}, mongoose.Document<unknown, {}, IDeposit, {}> & IDeposit & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
