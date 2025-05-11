import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IPerformanceMetrics {
  totalReturn: number;
  annualizedReturn: number;
  sharpeRatio: number;
  sortinoRatio: number;
  maxDrawdown: number;
  winRate: number;
  profitFactor: number;
  averageTrade: number;
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
}

export interface IPerformance extends IPerformanceMetrics {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  strategyId: Types.ObjectId;
  period: {
    start: Date;
    end: Date;
  };
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPerformanceDocument extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  strategyId: Types.ObjectId;
  period: {
    start: Date;
    end: Date;
  };
  totalReturn: number;
  annualizedReturn: number;
  sharpeRatio: number;
  sortinoRatio: number;
  maxDrawdown: number;
  winRate: number;
  profitFactor: number;
  averageTrade: number;
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const performanceSchema = new Schema<IPerformanceDocument>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  strategyId: { type: Schema.Types.ObjectId, ref: 'Strategy', required: true },
  period: {
    start: { type: Date, required: true },
    end: { type: Date, required: true }
  },
  totalReturn: { type: Number, required: true },
  annualizedReturn: { type: Number, required: true },
  sharpeRatio: { type: Number, required: true },
  sortinoRatio: { type: Number, required: true },
  maxDrawdown: { type: Number, required: true },
  winRate: { type: Number, required: true },
  profitFactor: { type: Number, required: true },
  averageTrade: { type: Number, required: true },
  totalTrades: { type: Number, required: true },
  winningTrades: { type: Number, required: true },
  losingTrades: { type: Number, required: true },
  metadata: { type: Schema.Types.Mixed, default: {} },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

performanceSchema.index({ userId: 1 });
performanceSchema.index({ strategyId: 1 });
performanceSchema.index({ 'period.start': -1 });
performanceSchema.index({ 'period.end': -1 });
performanceSchema.index({ totalReturn: -1 });
performanceSchema.index({ createdAt: -1 });

export const Performance = mongoose.model<IPerformanceDocument>('Performance', performanceSchema);
export default Performance; 