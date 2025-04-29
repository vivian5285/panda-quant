import mongoose, { Document, Schema } from 'mongoose';

export interface IStrategyRating extends Document {
  strategyId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  rating: number;
  comment?: string;
  createdAt: Date;
  updatedAt: Date;
}

const strategyRatingSchema = new Schema<IStrategyRating>(
  {
    strategyId: {
      type: Schema.Types.ObjectId,
      ref: 'Strategy',
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      maxlength: 500,
    },
  },
  {
    timestamps: true,
  }
);

// 创建复合唯一索引，确保一个用户只能对同一个策略评价一次
strategyRatingSchema.index({ strategyId: 1, userId: 1 }, { unique: true });

export const StrategyRating = mongoose.model<IStrategyRating>('StrategyRating', strategyRatingSchema); 