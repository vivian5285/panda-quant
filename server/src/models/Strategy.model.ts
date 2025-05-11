import mongoose, { Schema, Document, Types } from 'mongoose';
import { StrategyType, StrategyStatus } from '../types/Enums';
import { PerformanceMetrics } from '../types/Performance';

export interface IStrategy {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  name: string;
  description: string;
  type: StrategyType;
  status: StrategyStatus;
  config: {
    exchange: string;
    symbol: string;
    timeframe: string;
    parameters: Record<string, any>;
    riskManagement: {
      maxPositionSize: number;
      stopLoss: number;
      takeProfit: number;
      trailingStop: number;
      maxDrawdown: number;
      maxOpenTrades: number;
    };
    filters: {
      minVolume: number;
      minVolatility: number;
      maxSpread: number;
      allowedSymbols: string[];
      excludedSymbols: string[];
    };
    notifications: {
      email: boolean;
      telegram: boolean;
      webhook: boolean;
    };
  };
  performance?: PerformanceMetrics;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface IStrategyDocument extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  name: string;
  description: string;
  type: StrategyType;
  status: StrategyStatus;
  config: {
    exchange: string;
    symbol: string;
    timeframe: string;
    parameters: Record<string, any>;
    riskManagement: {
      maxPositionSize: number;
      stopLoss: number;
      takeProfit: number;
      trailingStop: number;
      maxDrawdown: number;
      maxOpenTrades: number;
    };
    filters: {
      minVolume: number;
      minVolatility: number;
      maxSpread: number;
      allowedSymbols: string[];
      excludedSymbols: string[];
    };
    notifications: {
      email: boolean;
      telegram: boolean;
      webhook: boolean;
    };
  };
  performance?: PerformanceMetrics;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

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
    largestWin: { type: Number, default: 0 },
    largestLoss: { type: Number, default: 0 },
    averageHoldingTime: { type: Number, default: 0 },
    sharpeRatio: { type: Number, default: 0 },
    sortinoRatio: { type: Number, default: 0 },
    maxDrawdown: { type: Number, default: 0 },
    maxDrawdownDuration: { type: Number, default: 0 },
    totalReturn: { type: Number, default: 0 },
    annualizedReturn: { type: Number, default: 0 },
    volatility: { type: Number, default: 0 },
    beta: { type: Number, default: 0 },
    alpha: { type: Number, default: 0 },
    informationRatio: { type: Number, default: 0 },
    calmarRatio: { type: Number, default: 0 },
    treynorRatio: { type: Number, default: 0 },
    ulcerIndex: { type: Number, default: 0 },
    valueAtRisk: { type: Number, default: 0 },
    expectedShortfall: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  },
  metadata: { type: Schema.Types.Mixed, default: {} },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

strategySchema.index({ userId: 1 });
strategySchema.index({ name: 1 });
strategySchema.index({ type: 1 });
strategySchema.index({ status: 1 });
strategySchema.index({ 'config.symbol': 1 });
strategySchema.index({ 'config.timeframe': 1 });
strategySchema.index({ createdAt: -1 });

export const Strategy = mongoose.model<IStrategyDocument>('Strategy', strategySchema);
export default Strategy; 