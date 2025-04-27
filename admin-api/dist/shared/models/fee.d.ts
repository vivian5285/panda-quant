import mongoose, { Document } from 'mongoose';
import { IUser } from './user';
import { IAsset } from './asset';
export interface IFee extends Document {
    userId: string;
    amount: number;
    type: string;
    status: 'pending' | 'completed';
    createdAt: Date;
    updatedAt: Date;
    user?: IUser;
    asset?: IAsset;
}
export declare const Fee: mongoose.Model<IFee, {}, {}, {}, mongoose.Document<unknown, {}, IFee, {}> & IFee & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
