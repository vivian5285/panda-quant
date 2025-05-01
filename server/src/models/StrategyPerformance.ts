import { Schema, model, Document } from 'mongoose';

export interface IStrategyPerformance {
  strategyId: string;
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
}

export interface IStrategyPerformanceDocument extends Document {
  strategyId: string;
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
  createdAt: Date;
  updatedAt: Date;
}

const strategyPerformanceSchema = new Schema<IStrategyPerformanceDocument>({
  strategyId: { type: String, required: true },
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
  losingTrades: { type: Number, required: true }
}, {
  timestamps: true
});

export const StrategyPerformance = model<IStrategyPerformanceDocument>('StrategyPerformance', strategyPerformanceSchema);
export default StrategyPerformance; 