import mongoose, { Document } from 'mongoose';
export interface ITransaction extends Document {
    userId: mongoose.Types.ObjectId;
    type: 'deposit' | 'withdrawal' | 'fee' | 'reward';
    amount: number;
    status: 'pending' | 'completed' | 'failed';
    description: string;
    createdAt: Date;
    updatedAt: Date;
}
declare const Transaction: mongoose.Model<ITransaction, {}, {}, {}, mongoose.Document<unknown, {}, ITransaction, {}> & ITransaction & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default Transaction;
