import mongoose, { Schema } from 'mongoose';
import { IStrategy, IStrategyDocument } from '../types/Strategy';
import { StrategyStatus } from '../types/Enums';

const strategySchema = new Schema<IStrategyDocument>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, required: true },
  status: { type: String, enum: Object.values(StrategyStatus), default: StrategyStatus.ACTIVE },
  config: {
    exchange: { type: String, required: true },
    symbol: { type: String, required: true },
    timeframe: { type: String, required: true },
    parameters: { type: Schema.Types.Mixed, required: true },
    riskManagement: {
      maxPositionSize: { type: Number, required: true },
      stopLoss: { type: Number, required: true },
      takeProfit: { type: Number, required: true },
      trailingStop: { type: Number, required: true },
      maxDrawdown: { type: Number, required: true },
      maxOpenTrades: { type: Number, required: true }
    },
    filters: {
      minVolume: { type: Number, required: true },
      minVolatility: { type: Number, required: true },
      maxSpread: { type: Number, required: true },
      allowedSymbols: [{ type: String }],
      excludedSymbols: [{ type: String }]
    },
    notifications: {
      email: { type: Boolean, default: false },
      telegram: { type: Boolean, default: false },
      webhook: { type: Boolean, default: false }
    }
  },
  performance: { type: Schema.Types.Mixed },
  metadata: { type: Schema.Types.Mixed },
  createdAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

export const Strategy = mongoose.model<IStrategyDocument>('Strategy', strategySchema);
export default Strategy; 