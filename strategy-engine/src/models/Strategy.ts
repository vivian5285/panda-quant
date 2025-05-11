import { Schema, model } from 'mongoose';
import { IStrategy, StrategyType, StrategyStatus } from '../types';

const strategySchema = new Schema<IStrategy>({
  userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  name: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, required: true, enum: Object.values(StrategyType) },
  status: { type: String, required: true, enum: Object.values(StrategyStatus), default: StrategyStatus.STOPPED },
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
  performance: {
    totalTrades: { type: Number, default: 0 },
    winningTrades: { type: Number, default: 0 },
    losingTrades: { type: Number, default: 0 },
    winRate: { type: Number, default: 0 },
    profitFactor: { type: Number, default: 0 },
    averageWin: { type: Number, default: 0 },
    averageLoss: { type: Number, default: 0 },
    maxDrawdown: { type: Number, default: 0 },
    sharpeRatio: { type: Number, default: 0 },
    sortinoRatio: { type: Number, default: 0 },
    totalProfit: { type: Number, default: 0 },
    monthlyReturns: [{ type: Number }],
    dailyReturns: [{ type: Number }]
  },
  metadata: { type: Schema.Types.Mixed }
}, {
  timestamps: true
});

export default model<IStrategy>('Strategy', strategySchema); 