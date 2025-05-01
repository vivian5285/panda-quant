import mongoose from 'mongoose';

const strategyRatingSchema = new mongoose.Schema({
  strategyId: {
    type: String,
    required: true
  },
  userId: {
    type: String,
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
    maxlength: 500
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

// 创建复合唯一索引
strategyRatingSchema.index({ strategyId: 1, userId: 1 }, { unique: true });

export const StrategyRating = mongoose.model('StrategyRating', strategyRatingSchema); 