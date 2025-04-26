import mongoose, { Document, Schema } from 'mongoose';

export interface IProfit extends Document {
  userId: string;
  strategyId: string;
  date: Date;
  profit: number;
  totalProfit: number;
}

const profitSchema = new Schema<IProfit>({
  userId: {
    type: String,
    required: [true, '用户ID不能为空'],
    index: true
  },
  strategyId: {
    type: String,
    required: [true, '策略ID不能为空'],
    index: true
  },
  date: {
    type: Date,
    required: [true, '日期不能为空'],
    index: true
  },
  profit: {
    type: Number,
    required: [true, '收益不能为空']
  },
  totalProfit: {
    type: Number,
    required: [true, '总收益不能为空']
  }
}, {
  timestamps: true
});

// 添加复合索引
profitSchema.index({ userId: 1, date: 1 });
profitSchema.index({ strategyId: 1, date: 1 });

export const Profit = mongoose.model<IProfit>('Profit', profitSchema); 