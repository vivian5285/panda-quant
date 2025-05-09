import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IStrategyPerformance {
  _id: Types.ObjectId;
  strategyId: Types.ObjectId;
  period: {
    start: Date;
    end: Date;
  };
  metrics: {
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
  };
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface IStrategyPerformanceDocument extends Document {
  _id: Types.ObjectId;
  strategyId: Types.ObjectId;
  period: {
    start: Date;
    end: Date;
  };
  metrics: {
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
  };
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const strategyPerformanceSchema = new Schema<IStrategyPerformanceDocument>({
  strategyId: { type: Schema.Types.ObjectId, ref: 'Strategy', required: true },
  period: {
    start: { type: Date, required: true },
    end: { type: Date, required: true }
  },
  metrics: {
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
    losingTrades: { type: Number, required: true }
  },
  metadata: { type: Schema.Types.Mixed, default: {} },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// 添加索引
strategyPerformanceSchema.index({ strategyId: 1 });
strategyPerformanceSchema.index({ 'period.start': -1 });
strategyPerformanceSchema.index({ 'period.end': -1 });
strategyPerformanceSchema.index({ 'metrics.totalReturn': -1 });
strategyPerformanceSchema.index({ createdAt: -1 });

export const StrategyPerformance = mongoose.model<IStrategyPerformanceDocument>('StrategyPerformance', strategyPerformanceSchema);
export default StrategyPerformance; 