import mongoose, { Document } from 'mongoose';

export interface IAsset extends Document {
    _id: string;
    name: string;
    symbol: string;
    price: number;
    chain: string;
    address: string;
    decimals: number;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface IUserAsset extends Document {
    _id: string;
    userId: string;
    assetId: string;
    amount: number;
    balance: number;
    status: string;
    lastFeeDeduction: Date;
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

const assetSchema = new mongoose.Schema({
    name: { type: String, required: true },
    symbol: { type: String, required: true },
    price: { type: Number, required: true },
    chain: { type: String, required: true },
    address: { type: String, required: true },
    decimals: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const userAssetSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    assetId: { type: String, required: true },
    amount: { type: Number, required: true },
    balance: { type: Number, default: 0 },
    status: { type: String, default: 'active' },
    lastFeeDeduction: { type: Date, default: Date.now },
    lastUpdated: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const feeSchema = new mongoose.Schema<IFee>({
    userId: { type: String, required: true },
    amount: { type: Number, required: true },
    type: { type: String, required: true },
    status: { type: String, required: true, default: 'pending' },
    createdAt: { type: Date, default: Date.now }
});

export const Asset = mongoose.model<IAsset>('Asset', assetSchema);
export const UserAsset = mongoose.model<IUserAsset>('UserAsset', userAssetSchema);
export const Fee = mongoose.model<IFee>('Fee', feeSchema); 