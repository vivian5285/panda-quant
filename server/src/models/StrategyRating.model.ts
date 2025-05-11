import { Schema, model } from 'mongoose';
import { IStrategyRating, IStrategyRatingDocument } from '../types/Strategy';

const strategyRatingSchema = new Schema<IStrategyRatingDocument>({
  strategyId: { type: Schema.Types.ObjectId, ref: 'Strategy', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

strategyRatingSchema.index({ strategyId: 1 });
strategyRatingSchema.index({ userId: 1 });
strategyRatingSchema.index({ createdAt: 1 });

export const StrategyRating = model<IStrategyRatingDocument>('StrategyRating', strategyRatingSchema);
export type { IStrategyRating, IStrategyRatingDocument };
export default StrategyRating; 