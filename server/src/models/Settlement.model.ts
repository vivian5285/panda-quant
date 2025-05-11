import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ISettlement {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  amount: number;
  currency: string;
  type: 'profit' | 'commission' | 'referral';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  description: string;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISettlementDocument extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  amount: number;
  currency: string;
  type: 'profit' | 'commission' | 'referral';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  description: string;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const settlementSchema = new Schema<ISettlementDocument>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  type: { type: String, enum: ['profit', 'commission', 'referral'], required: true },
  status: { type: String, enum: ['pending', 'processing', 'completed', 'failed'], required: true },
  description: { type: String, required: true },
  metadata: { type: Schema.Types.Mixed, default: {} },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

settlementSchema.index({ userId: 1 });
settlementSchema.index({ type: 1 });
settlementSchema.index({ status: 1 });
settlementSchema.index({ currency: 1 });
settlementSchema.index({ createdAt: -1 });

export const Settlement = mongoose.model<ISettlementDocument>('Settlement', settlementSchema);
export default Settlement; 