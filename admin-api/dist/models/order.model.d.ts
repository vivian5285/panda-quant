import mongoose, { Document } from 'mongoose';
export interface IOrder extends Document {
    userId: mongoose.Types.ObjectId;
    type: 'deposit' | 'withdrawal' | 'hosting_fee';
    amount: number;
    chain?: string;
    address?: string;
    status: 'pending' | 'approved' | 'rejected' | 'completed';
    remark?: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare const Order: mongoose.Model<IOrder, {}, {}, {}, mongoose.Document<unknown, {}, IOrder, {}> & IOrder & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
