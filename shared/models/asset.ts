import mongoose from 'mongoose';

export interface IAsset {
    name: string;
    symbol: string;
    price: number;
    marketCap: number;
    volume24h: number;
    change24h: number;
    lastUpdated: Date;
}

export interface IUserAsset {
    userId: string;
    assetId: string;
    amount: number;
    averagePrice: number;
    totalValue: number;
    lastUpdated: Date;
}

export interface IFee {
    userId: string;
    amount: number;
    type: string;
    status: string;
    createdAt: Date;
}

const assetSchema = new mongoose.Schema<IAsset>({
    name: { type: String, required: true },
    symbol: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    marketCap: { type: Number, required: true },
    volume24h: { type: Number, required: true },
    change24h: { type: Number, required: true },
    lastUpdated: { type: Date, default: Date.now }
});

const userAssetSchema = new mongoose.Schema<IUserAsset>({
    userId: { type: String, required: true },
    assetId: { type: String, required: true },
    amount: { type: Number, required: true },
    averagePrice: { type: Number, required: true },
    totalValue: { type: Number, required: true },
    lastUpdated: { type: Date, default: Date.now }
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