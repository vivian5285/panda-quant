import { Schema, model, Document } from 'mongoose';

export interface IAsset extends Document {
    name: string;
    symbol: string;
    price: number;
    status: 'active' | 'inactive';
    createdAt: Date;
    updatedAt: Date;
}

const assetSchema = new Schema<IAsset>({
  name: { type: String, required: true },
  symbol: { type: String, required: true },
  price: { type: Number, required: true },
  status: { type: String, default: 'active' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const Asset = model<IAsset>('Asset', assetSchema); 