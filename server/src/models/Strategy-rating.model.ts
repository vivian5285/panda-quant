import mongoose, { Schema, Document, Types } from 'mongoose';
import { IStrategyRating } from '../types/StrategyRating';

export interface IStrategyRatingDocument extends Document {
  _id: Types.ObjectId;
  strategyId: Types.ObjectId;
  userId: Types.ObjectId;
  rating: number;
  comment: string;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const strategyRatingSchema = new Schema<IStrategyRatingDocument>({
  strategyId: {
    type: Schema.Types.ObjectId,
    ref: 'Strategy',
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    default: ''
  },
  metadata: {
    type: Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

// 添加索引
strategyRatingSchema.index({ strategyId: 1 });
strategyRatingSchema.index({ userId: 1 });
strategyRatingSchema.index({ rating: 1 });
strategyRatingSchema.index({ createdAt: -1 });

// 确保每个用户只能对同一个策略评分一次
strategyRatingSchema.index({ strategyId: 1, userId: 1 }, { unique: true });

export const StrategyRatingModel = mongoose.model<IStrategyRatingDocument>('StrategyRating', strategyRatingSchema);
export default StrategyRatingModel; 