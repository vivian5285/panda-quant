import { Schema, model, Types } from 'mongoose';

export interface IStrategyRating {
  userId: Types.ObjectId;
  strategyId: Types.ObjectId;
  rating: number;
  comment?: string;
  createdAt: Date;
  updatedAt: Date;
}

const strategyRatingSchema = new Schema<IStrategyRating>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  strategyId: { type: Schema.Types.ObjectId, ref: 'Strategy', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const StrategyRating = model<IStrategyRating>('StrategyRating', strategyRatingSchema); 