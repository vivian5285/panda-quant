import { Schema, model } from 'mongoose';
import { IStrategy, IStrategyDocument, IStrategyConfig, IStrategyPerformanceMetrics } from '../types/Strategy';
import { StrategyType, StrategyStatus } from '../types/Enums';

const strategySchema = new Schema<IStrategyDocument>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, enum: Object.values(StrategyType), required: true },
  status: { type: String, enum: Object.values(StrategyStatus), required: true },
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
  metadata: {
    history: [{
      timestamp: { type: Date, required: true },
      action: { type: String, required: true },
      details: { type: Schema.Types.Mixed }
    }],
    tags: [{ type: String }],
    category: { type: String },
    version: { type: String },
    lastUpdated: { type: Date }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

strategySchema.index({ userId: 1 });
strategySchema.index({ status: 1 });
strategySchema.index({ createdAt: 1 });

export const Strategy = model<IStrategyDocument>('Strategy', strategySchema);
export type { IStrategy, IStrategyDocument };
export default Strategy; 