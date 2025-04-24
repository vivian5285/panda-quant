import { Schema, model } from 'mongoose';

export interface IStrategyReview {
  strategyId: Schema.Types.ObjectId;
  reviewerId: Schema.Types.ObjectId;
  status: 'pending' | 'approved' | 'rejected';
  rating: number;
  review: string;
  feedback?: string;
  createdAt: Date;
  updatedAt: Date;
}

const strategyReviewSchema = new Schema<IStrategyReview>({
  strategyId: {
    type: Schema.Types.ObjectId,
    ref: 'Strategy',
    required: true
  },
  reviewerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  review: {
    type: String,
    required: true,
    minlength: 10
  },
  feedback: {
    type: String
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

// 更新时自动更新 updatedAt
strategyReviewSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export const StrategyReview = model<IStrategyReview>('StrategyReview', strategyReviewSchema); 