import { Schema, model } from 'mongoose';
import { IDepositDocument } from '../types/Deposit';

const depositSchema = new Schema<IDepositDocument>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const Deposit = model<IDepositDocument>('Deposit', depositSchema); 