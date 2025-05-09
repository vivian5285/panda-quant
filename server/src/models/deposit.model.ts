import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IDeposit {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  transactionId: string;
  network: string;
  address: string;
  fee: number;
  feeCurrency: string;
  error: string;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface IDepositDocument extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  transactionId: string;
  network: string;
  address: string;
  fee: number;
  feeCurrency: string;
  error: string;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const depositSchema = new Schema<IDepositDocument>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  status: { type: String, enum: ['pending', 'processing', 'completed', 'failed', 'cancelled'], required: true },
  transactionId: { type: String, required: true },
  network: { type: String, required: true },
  address: { type: String, required: true },
  fee: { type: Number, required: true },
  feeCurrency: { type: String, required: true },
  error: { type: String },
  metadata: { type: Schema.Types.Mixed, default: {} },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// 添加索引
depositSchema.index({ userId: 1 });
depositSchema.index({ status: 1 });
depositSchema.index({ currency: 1 });
depositSchema.index({ network: 1 });
depositSchema.index({ transactionId: 1 });
depositSchema.index({ createdAt: -1 });

export const Deposit = mongoose.model<IDepositDocument>('Deposit', depositSchema);
export default Deposit; 