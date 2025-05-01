import { Schema, model, Document } from 'mongoose';

export interface IAsset extends Document {
    userId: string;
    chain: string;
    address: string;
    balance: number;
    name: string;
    symbol: string;
    price: number;
    status: 'active' | 'inactive';
    createdAt: Date;
    updatedAt: Date;
}

const assetSchema = new Schema<IAsset>({
  userId: { type: String, required: true },
  chain: { type: String, required: true },
  address: { type: String, required: true },
  balance: { type: Number, default: 0 },
  name: { type: String, required: true },
  symbol: { type: String, required: true },
  price: { type: Number, required: true },
  status: { type: String, default: 'active' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const Asset = model<IAsset>('Asset', assetSchema); 