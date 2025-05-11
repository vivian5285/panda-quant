import mongoose, { Schema, Document, Types } from 'mongoose';
import { IRiskEvent } from '../types/Risk';

export interface IRiskEventDocument extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  type: 'withdrawal' | 'deposit' | 'trade' | 'login' | 'other';
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'resolved' | 'dismissed';
  description: string;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const riskEventSchema = new Schema<IRiskEventDocument>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['withdrawal', 'deposit', 'trade', 'login', 'other'],
    required: true
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'resolved', 'dismissed'],
    default: 'pending'
  },
  description: {
    type: String,
    required: true
  },
  metadata: {
    type: Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

// 添加索引
riskEventSchema.index({ userId: 1 });
riskEventSchema.index({ type: 1 });
riskEventSchema.index({ severity: 1 });
riskEventSchema.index({ status: 1 });
riskEventSchema.index({ createdAt: -1 });

export const RiskEventModel = mongoose.model<IRiskEventDocument>('RiskEvent', riskEventSchema);
export default RiskEventModel; 