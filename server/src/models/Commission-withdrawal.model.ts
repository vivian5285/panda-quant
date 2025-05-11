import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ICommissionWithdrawal {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  transactionId: string;
  error: string;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICommissionWithdrawalDocument extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  transactionId: string;
  error: string;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const commissionWithdrawalSchema = new Schema<ICommissionWithdrawalDocument>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  status: { type: String, enum: ['pending', 'processing', 'completed', 'failed', 'cancelled'], required: true },
  transactionId: { type: String },
  error: { type: String },
  metadata: { type: Schema.Types.Mixed, default: {} },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// 添加索引
commissionWithdrawalSchema.index({ userId: 1 });
commissionWithdrawalSchema.index({ status: 1 });
commissionWithdrawalSchema.index({ currency: 1 });
commissionWithdrawalSchema.index({ transactionId: 1 });
commissionWithdrawalSchema.index({ createdAt: -1 });

export const CommissionWithdrawal = mongoose.model<ICommissionWithdrawalDocument>('CommissionWithdrawal', commissionWithdrawalSchema);
export default CommissionWithdrawal; 