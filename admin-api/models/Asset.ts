import { Schema, model } from 'mongoose';
import { IAsset } from '../../shared/models/asset';

const assetSchema = new Schema<IAsset>({
  name: { type: String, required: true },
  symbol: { type: String, required: true },
  price: { type: Number, required: true },
  status: { type: String, default: 'active' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const Asset = model<IAsset>('Asset', assetSchema); 