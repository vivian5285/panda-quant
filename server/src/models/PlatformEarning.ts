import mongoose, { Document, Schema } from 'mongoose';

export interface IPlatformEarning extends Document {
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

const platformEarningSchema = new Schema<IPlatformEarning>({
  userId: {
    type: String,
    required: [true, '用户ID是必需的'],
    trim: true
  },
  strategyId: {
    type: String,
    required: [true, '策略ID是必需的'],
    trim: true
  },
  amount: {
    type: Number,
    required: [true, '金额是必需的']
  },
  currency: {
    type: String,
    required: [true, '货币是必需的'],
    trim: true
  },
  type: {
    type: String,
    required: [true, '类型是必需的'],
    enum: {
      values: ['commission', 'fee', 'other'],
      message: '无效的类型'
    }
  },
  description: {
    type: String,
    trim: true
  },
  metadata: {
    type: Schema.Types.Mixed
  }
}, {
  timestamps: true
});

// 添加索引
platformEarningSchema.index({ userId: 1 });
platformEarningSchema.index({ strategyId: 1 });
platformEarningSchema.index({ type: 1 });
platformEarningSchema.index({ createdAt: -1 });

export const PlatformEarning = mongoose.model<IPlatformEarning>('PlatformEarning', platformEarningSchema); 