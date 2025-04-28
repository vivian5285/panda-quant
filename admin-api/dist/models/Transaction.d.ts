import { Document } from 'mongoose';
export interface ITransaction extends Document {
    _id: string;
    userId: string;
    type: string;
    amount: number;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare const Transaction: import("mongoose").Model<ITransaction, {}, {}, {}, Document<unknown, {}, ITransaction, {}> & ITransaction & Required<{
    _id: string;
}> & {
    __v: number;
}, any>;
