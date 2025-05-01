import { Schema, model } from 'mongoose';
import { IStrategyPerformance } from '../types';

const strategyPerformanceSchema = new Schema<IStrategyPerformance>({
  userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  strategyId: { type: Schema.Types.ObjectId, required: true, ref: 'Strategy' },
  profit: { type: Number, required: true },
}, {
  timestamps: true
});

export default model<IStrategyPerformance>('StrategyPerformance', strategyPerformanceSchema); 