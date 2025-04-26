import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IStrategyPerformance extends Document {
  _id: Types.ObjectId;
  strategyId: Types.ObjectId;
  userId: Types.ObjectId;
  profit: number;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const strategyPerformanceSchema = new Schema<IStrategyPerformance>({
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
  profit: {
    type: Number,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  }
}, {
  timestamps: true
});

export const StrategyPerformance = mongoose.model<IStrategyPerformance>('StrategyPerformance', strategyPerformanceSchema); 