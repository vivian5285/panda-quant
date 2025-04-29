import mongoose, { Schema, Document } from 'mongoose';
import { Types } from 'mongoose';

export interface ITransaction extends Document {
  userId: Types.ObjectId;
  type: 'deposit' | 'withdrawal' | 'commission' | 'refund';
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  referenceId: Types.ObjectId;
  referenceType: 'Deposit' | 'Withdrawal' | 'CommissionRecord';
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const transactionSchema = new Schema<ITransaction>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['deposit', 'withdrawal', 'commission', 'refund'], required: true },
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
  referenceId: { type: Schema.Types.ObjectId, required: true },
  referenceType: { type: String, enum: ['Deposit', 'Withdrawal', 'CommissionRecord'], required: true },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const Transaction = mongoose.model<ITransaction>('Transaction', transactionSchema); 