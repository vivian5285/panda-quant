import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IPlatformEarning {
  userId: Types.ObjectId;
  strategyId: Types.ObjectId;
  amount: number;
  currency: string;
  type: 'commission' | 'fee' | 'other';
  status: 'pending' | 'completed' | 'failed';
  description?: string;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPlatformEarningDocument extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  strategyId: Types.ObjectId;
  amount: number;
  currency: string;
  type: 'commission' | 'fee' | 'other';
  status: 'pending' | 'completed' | 'failed';
  description?: string;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const platformEarningSchema = new Schema<IPlatformEarningDocument>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, '用户ID是必需的']
  },
  strategyId: {
    type: Schema.Types.ObjectId,
    ref: 'Strategy',
    required: [true, '策略ID是必需的']
  },
  amount: {
    type: Number,
    required: [true, '金额是必需的'],
    min: 0
  },
  currency: {
    type: String,
    required: [true, '货币是必需的'],
    trim: true
  },
  type: {
    type: String,
    enum: ['commission', 'fee', 'other'],
    required: [true, '类型是必需的']
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    required: true
  },
  description: {
    type: String,
    trim: true
  },
  metadata: {
    type: Schema.Types.Mixed,
    default: {}
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// 添加索引
platformEarningSchema.index({ userId: 1 });
platformEarningSchema.index({ strategyId: 1 });
platformEarningSchema.index({ type: 1 });
platformEarningSchema.index({ status: 1 });
platformEarningSchema.index({ currency: 1 });
platformEarningSchema.index({ createdAt: -1 });

export const PlatformEarning = mongoose.model<IPlatformEarningDocument>('PlatformEarning', platformEarningSchema);
export default PlatformEarning; 