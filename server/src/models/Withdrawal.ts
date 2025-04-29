import mongoose, { Schema, Document } from 'mongoose';
import { Types } from 'mongoose';

export interface IWithdrawal extends Document {
  userId: Types.ObjectId;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  network: string;
  address: string;
  transactionId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const withdrawalSchema = new Schema<IWithdrawal>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
  network: { type: String, required: true },
  address: { type: String, required: true },
  transactionId: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const Withdrawal = mongoose.model<IWithdrawal>('Withdrawal', withdrawalSchema); 