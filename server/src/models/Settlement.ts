import mongoose, { Document, Schema } from 'mongoose';

export interface ISettlement extends Document {
  _id: mongoose.Types.ObjectId;
  userId: string;
  strategyId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  type: 'profit' | 'loss' | 'fee';
  description?: string;
  platformShare?: number;
  level1Share?: number;
  level2Share?: number;
  metadata?: {
    commissionIds?: mongoose.Types.ObjectId[];
    [key: string]: any;
  };
  createdAt: Date;
  updatedAt: Date;
}

const settlementSchema = new Schema<ISettlement>({
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
  status: {
    type: String,
    required: [true, '状态是必需的'],
    enum: {
      values: ['pending', 'completed', 'failed'],
      message: '无效的状态'
    },
    default: 'pending'
  },
  type: {
    type: String,
    required: [true, '类型是必需的'],
    enum: {
      values: ['profit', 'loss', 'fee'],
      message: '无效的类型'
    }
  },
  description: {
    type: String,
    trim: true
  },
  platformShare: {
    type: Number,
    default: 0
  },
  level1Share: {
    type: Number,
    default: 0
  },
  level2Share: {
    type: Number,
    default: 0
  },
  metadata: {
    type: Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

// 添加索引
settlementSchema.index({ userId: 1 });
settlementSchema.index({ strategyId: 1 });
settlementSchema.index({ status: 1 });
settlementSchema.index({ createdAt: -1 });

export const Settlement = mongoose.model<ISettlement>('Settlement', settlementSchema); 