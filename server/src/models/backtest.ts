import { Schema, model, Document, Types } from 'mongoose';

export interface IBacktestDocument extends Document {
  strategyId: Types.ObjectId;
  userId: Types.ObjectId;
  startDate: Date;
  endDate: Date;
  initialBalance: number;
  finalBalance: number;
  totalReturn: number;
  annualizedReturn: number;
  sharpeRatio: number;
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

const backtestSchema = new Schema<IBacktestDocument>({
  strategyId: { type: Schema.Types.ObjectId, ref: 'Strategy', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  initialBalance: { type: Number, required: true },
  finalBalance: { type: Number, required: true },
  totalReturn: { type: Number, required: true },
  annualizedReturn: { type: Number, required: true },
  sharpeRatio: { type: Number, required: true },
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

export const Backtest = model<IBacktestDocument>('Backtest', backtestSchema);
export default Backtest; 