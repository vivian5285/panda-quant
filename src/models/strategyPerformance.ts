import mongoose, { Document, Schema } from 'mongoose';

export interface IStrategyPerformance extends Document {
  strategyId: string;
  userId: string;
  performance: number;
  commissionEarned: number;
  createdAt: Date;
  updatedAt: Date;
}

const StrategyPerformanceSchema = new Schema({
  strategyId: { type: String, required: true },
  userId: { type: String, required: true },
  performance: { type: Number, required: true },
  commissionEarned: { type: Number, required: true },
}, {
  timestamps: true
});

export const StrategyPerformance = mongoose.model<IStrategyPerformance>('StrategyPerformance', StrategyPerformanceSchema); 