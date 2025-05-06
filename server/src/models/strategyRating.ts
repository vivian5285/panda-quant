import { Schema, model, Document, Types } from 'mongoose';
import { IStrategyRating } from '../types/StrategyRating';

const strategyRatingSchema = new Schema({
  strategyId: {
    type: Types.ObjectId,
    ref: 'Strategy',
    required: true
  },
  userId: {
    type: Types.ObjectId,
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
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

export interface IStrategyRatingDocument extends IStrategyRating, Document {
  _id: Types.ObjectId;
}

export const StrategyRating = model<IStrategyRatingDocument>('StrategyRating', strategyRatingSchema); 