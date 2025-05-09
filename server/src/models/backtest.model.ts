import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IBacktest {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  strategyId: Types.ObjectId;
  name: string;
  description: string;
  period: {
    start: Date;
    end: Date;
  };
  parameters: Record<string, any>;
  results: {
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
  status: 'running' | 'completed' | 'failed';
  error: string;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface IBacktestDocument extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  strategyId: Types.ObjectId;
  name: string;
  description: string;
  period: {
    start: Date;
    end: Date;
  };
  parameters: Record<string, any>;
  results: {
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
  status: 'running' | 'completed' | 'failed';
  error: string;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const backtestSchema = new Schema<IBacktestDocument>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  strategyId: { type: Schema.Types.ObjectId, ref: 'Strategy', required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  period: {
    start: { type: Date, required: true },
    end: { type: Date, required: true }
  },
  parameters: { type: Schema.Types.Mixed, required: true },
  results: {
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
  status: { type: String, enum: ['running', 'completed', 'failed'], required: true },
  error: { type: String },
  metadata: { type: Schema.Types.Mixed, default: {} },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// 添加索引
backtestSchema.index({ userId: 1 });
backtestSchema.index({ strategyId: 1 });
backtestSchema.index({ status: 1 });
backtestSchema.index({ 'period.start': -1 });
backtestSchema.index({ 'period.end': -1 });
backtestSchema.index({ createdAt: -1 });

export const Backtest = mongoose.model<IBacktestDocument>('Backtest', backtestSchema);
export default Backtest; 