import { Schema, model } from 'mongoose';
import { IFee } from '@shared/models/fee';

const feeSchema = new Schema<IFee>({
  userId: { type: String, required: true },
  amount: { type: Number, required: true },
  type: { type: String, required: true },
  status: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const Fee = model<IFee>('Fee', feeSchema); 