import mongoose, { Schema } from 'mongoose';
import { IStrategyPerformance } from '../types/StrategyPerformance';

const strategyPerformanceSchema = new Schema<IStrategyPerformance>({
  strategyId: { type: String, required: true },
  userId: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  totalReturn: { type: Number, required: true },
  sharpeRatio: { type: Number, required: true },
  maxDrawdown: { type: Number, required: true },
  winRate: { type: Number, required: true },
  profitFactor: { type: Number, required: true },
  trades: { type: Number, required: true },
  averageTrade: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const StrategyPerformance = mongoose.model<IStrategyPerformance>('StrategyPerformance', strategyPerformanceSchema); 