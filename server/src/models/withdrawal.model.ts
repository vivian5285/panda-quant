import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IWithdrawal {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  amount: number;
  currency: string;
  network: string;
  address: string;
  fee: number;
  feeCurrency: string;
  status: 'pending' | 'completed' | 'failed';
  transactionId?: string;
  error?: string;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface IWithdrawalDocument extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  amount: number;
  currency: string;
  network: string;
  address: string;
  fee: number;
  feeCurrency: string;
  status: 'pending' | 'completed' | 'failed';
  transactionId?: string;
  error?: string;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const withdrawalSchema = new Schema<IWithdrawalDocument>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  network: { type: String, required: true },
  address: { type: String, required: true },
  fee: { type: Number, required: true },
  feeCurrency: { type: String, required: true },
  status: { type: String, enum: ['pending', 'completed', 'failed'], required: true },
  transactionId: { type: String },
  error: { type: String },
  metadata: { type: Schema.Types.Mixed, default: {} },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// 添加索引
withdrawalSchema.index({ userId: 1 });
withdrawalSchema.index({ currency: 1 });
withdrawalSchema.index({ network: 1 });
withdrawalSchema.index({ status: 1 });
withdrawalSchema.index({ transactionId: 1 });
withdrawalSchema.index({ createdAt: -1 });

export const Withdrawal = mongoose.model<IWithdrawalDocument>('Withdrawal', withdrawalSchema);
export default Withdrawal; 