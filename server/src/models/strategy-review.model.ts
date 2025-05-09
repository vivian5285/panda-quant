import mongoose, { Schema, Document, Types } from 'mongoose';
import { IStrategyReview } from '../types/StrategyReview';

export interface IStrategyReviewDocument extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  strategyId: Types.ObjectId;
  rating: number;
  comment?: string;
  status: 'active' | 'hidden' | 'deleted';
  likes: number;
  dislikes: number;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const strategyReviewSchema = new Schema<IStrategyReviewDocument>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  strategyId: { type: Schema.Types.ObjectId, ref: 'Strategy', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String },
  status: { type: String, enum: ['active', 'hidden', 'deleted'], default: 'active' },
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  metadata: { type: Schema.Types.Mixed, default: {} }
}, {
  timestamps: true
});

// 添加索引
strategyReviewSchema.index({ userId: 1 });
strategyReviewSchema.index({ strategyId: 1 });
strategyReviewSchema.index({ rating: 1 });
strategyReviewSchema.index({ status: 1 });
strategyReviewSchema.index({ createdAt: -1 });

// 确保每个用户只能对同一个策略评价一次
strategyReviewSchema.index({ strategyId: 1, userId: 1 }, { unique: true });

export const StrategyReviewModel = mongoose.model<IStrategyReviewDocument>('StrategyReview', strategyReviewSchema);
export default StrategyReviewModel; 