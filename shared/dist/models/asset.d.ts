import mongoose, { Document } from 'mongoose';
export interface IAsset extends Document {
    name: string;
    symbol: string;
    price: number;
    status: 'active' | 'inactive';
    balance: number;
    createdAt: Date;
    updatedAt: Date;
}
export interface IUserAsset extends Document {
    userId: string;
    assetId: string;
    amount: number;
    balance: number;
    status: 'active' | 'inactive';
    lastFeeDeduction?: Date;
    lastUpdated: Date;
    createdAt: Date;
    updatedAt: Date;
}
export interface IFee {
    userId: string;
    amount: number;
    type: string;
    status: string;
    createdAt: Date;
}
export declare const Asset: mongoose.Model<IAsset, {}, {}, {}, mongoose.Document<unknown, {}, IAsset, {}> & IAsset & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export declare const UserAsset: mongoose.Model<IUserAsset, {}, {}, {}, mongoose.Document<unknown, {}, IUserAsset, {}> & IUserAsset & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export declare const Fee: mongoose.Model<IFee, {}, {}, {}, mongoose.Document<unknown, {}, IFee, {}> & IFee & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, any>;
//# sourceMappingURL=asset.d.ts.map