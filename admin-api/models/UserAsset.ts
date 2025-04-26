import { Schema, model } from 'mongoose';
import { IUserAsset } from '../../shared/models/asset';

const userAssetSchema = new Schema<IUserAsset>({
  userId: { type: String, required: true },
  assetId: { type: String, required: true },
  amount: { type: Number, required: true },
  balance: { type: Number, default: 0 },
  status: { type: String, default: 'active' },
  lastFeeDeduction: { type: Date },
  lastUpdated: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const UserAsset = model<IUserAsset>('UserAsset', userAssetSchema); 