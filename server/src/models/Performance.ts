import mongoose, { Schema, Document } from 'mongoose';
import { PerformanceMetrics } from '../types';

export interface PerformanceDocument extends Document, PerformanceMetrics {
  strategyId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const performanceSchema = new Schema({
  strategyId: { type: Schema.Types.ObjectId, ref: 'Strategy', required: true },
  totalTrades: { type: Number, default: 0 },
  winningTrades: { type: Number, default: 0 },
  losingTrades: { type: Number, default: 0 },
  winRate: { type: Number, default: 0 },
  profitFactor: { type: Number, default: 0 },
  sharpeRatio: { type: Number, default: 0 },
  maxDrawdown: { type: Number, default: 0 },
  totalPnL: { type: Number, default: 0 },
  averagePnL: { type: Number, default: 0 },
  averageWin: { type: Number, default: 0 },
  averageLoss: { type: Number, default: 0 },
  bestTrade: { type: Number, default: 0 },
  worstTrade: { type: Number, default: 0 },
  averageHoldingTime: { type: Number, default: 0 },
  startBalance: { type: Number, default: 0 },
  currentBalance: { type: Number, default: 0 },
  roi: { type: Number, default: 0 }
}, {
  timestamps: true
});

export const Performance = mongoose.model<PerformanceDocument>('Performance', performanceSchema); 