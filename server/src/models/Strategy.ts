import { Schema, model } from 'mongoose';
import { IStrategy, StrategyStatus } from '../types/strategy';

const strategySchema = new Schema<IStrategy>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: String,
  type: {
    type: String,
    enum: Object.values(StrategyStatus),
    required: true
  },
  status: {
    type: String,
    enum: Object.values(StrategyStatus),
    default: StrategyStatus.ACTIVE
  },
  parameters: {
    type: Schema.Types.Mixed,
    default: {}
  },
  performance: {
    totalTrades: { type: Number, default: 0 },
    winRate: { type: Number, default: 0 },
    profit: { type: Number, default: 0 },
    metrics: { type: Schema.Types.Mixed, default: {} }
  },
  metadata: {
    type: Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

export const Strategy = model<IStrategy>('Strategy', strategySchema);
export default Strategy; 