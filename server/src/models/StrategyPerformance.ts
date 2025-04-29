import { Schema, model, Types } from 'mongoose';
import { IStrategyPerformance } from '../interfaces/IStrategyPerformance';

const strategyPerformanceSchema = new Schema<IStrategyPerformance>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  strategyId: { type: Schema.Types.ObjectId, ref: 'Strategy', required: true },
  profit: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

export const StrategyPerformance = model<IStrategyPerformance>('StrategyPerformance', strategyPerformanceSchema); 