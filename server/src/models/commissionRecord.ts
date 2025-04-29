import { Schema, model, Document, Types } from 'mongoose';

export interface ICommissionRecord extends Document {
  userId: Types.ObjectId | null; // null 表示平台佣金
  fromUserId: Types.ObjectId; // 产生佣金的用户
  amount: number;
  level: number; // 0: 平台佣金, 1: 一级推荐, 2: 二级推荐
  status: 'pending' | 'paid';
  strategyId: Types.ObjectId;
  performanceId: Types.ObjectId;
  createdAt: Date;
  paidAt?: Date;
}

const commissionRecordSchema = new Schema<ICommissionRecord>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  fromUserId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  level: {
    type: Number,
    required: true,
    enum: [0, 1, 2]
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'paid'],
    default: 'pending'
  },
  strategyId: {
    type: Schema.Types.ObjectId,
    ref: 'Strategy',
    required: true
  },
  performanceId: {
    type: Schema.Types.ObjectId,
    ref: 'StrategyPerformance',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  paidAt: {
    type: Date
  }
});

// 索引
commissionRecordSchema.index({ userId: 1, status: 1 });
commissionRecordSchema.index({ fromUserId: 1 });
commissionRecordSchema.index({ createdAt: -1 });

export const CommissionRecord = model<ICommissionRecord>('CommissionRecord', commissionRecordSchema); 