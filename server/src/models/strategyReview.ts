import { Schema, model } from 'mongoose';
import { IStrategyReviewDocument } from '../types/IStrategyReview';

const strategyReviewSchema = new Schema<IStrategyReviewDocument>({
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  strategyId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Strategy', 
    required: true 
  },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// 添加索引
strategyReviewSchema.index({ userId: 1 });
strategyReviewSchema.index({ strategyId: 1 });
strategyReviewSchema.index({ createdAt: -1 });

export const StrategyReview = model<IStrategyReviewDocument>('StrategyReview', strategyReviewSchema);
export default StrategyReview; 