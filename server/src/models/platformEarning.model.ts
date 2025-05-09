import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IPlatformEarning {
  _id: Types.ObjectId;
  userId: string;
  strategyId: string;
  amount: number;
  currency: string;
  type: 'commission' | 'fee' | 'other';
  description?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPlatformEarningDocument extends Document {
  _id: Types.ObjectId;
  userId: string;
  strategyId: string;
  amount: number;
  currency: string;
  type: 'commission' | 'fee' | 'other';
  description?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const platformEarningSchema = new Schema<IPlatformEarningDocument>({
  userId: { type: String, required: true },
  strategyId: { type: String, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  type: { type: String, enum: ['commission', 'fee', 'other'], required: true },
  description: { type: String },
  metadata: { type: Schema.Types.Mixed, default: {} },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

platformEarningSchema.index({ userId: 1 });
platformEarningSchema.index({ strategyId: 1 });
platformEarningSchema.index({ type: 1 });
platformEarningSchema.index({ createdAt: -1 });

export const PlatformEarning = mongoose.model<IPlatformEarningDocument>('PlatformEarning', platformEarningSchema);
export default PlatformEarning; 