import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ICommissionRecord {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  referrerId: Types.ObjectId;
  amount: number;
  currency: string;
  type: 'referral' | 'level';
  status: 'pending' | 'completed' | 'failed';
  description: string;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICommissionRecordDocument extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  referrerId: Types.ObjectId;
  amount: number;
  currency: string;
  type: 'referral' | 'level';
  status: 'pending' | 'completed' | 'failed';
  description: string;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const commissionRecordSchema = new Schema<ICommissionRecordDocument>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  referrerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  type: { type: String, enum: ['referral', 'level'], required: true },
  status: { type: String, enum: ['pending', 'completed', 'failed'], required: true },
  description: { type: String, required: true },
  metadata: { type: Schema.Types.Mixed, default: {} },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// 添加索引
commissionRecordSchema.index({ userId: 1 });
commissionRecordSchema.index({ referrerId: 1 });
commissionRecordSchema.index({ type: 1 });
commissionRecordSchema.index({ status: 1 });
commissionRecordSchema.index({ currency: 1 });
commissionRecordSchema.index({ createdAt: -1 });

export const CommissionRecord = mongoose.model<ICommissionRecordDocument>('CommissionRecord', commissionRecordSchema);
export default CommissionRecord; 