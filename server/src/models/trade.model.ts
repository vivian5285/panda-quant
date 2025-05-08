import mongoose, { Schema, Document } from 'mongoose';
import { ITradeBase } from '../types/Trading';

export interface ITrade extends ITradeBase, Document {}

const tradeSchema = new Schema<ITrade>({
  strategyId: { type: Schema.Types.ObjectId, ref: 'Strategy', required: true },
  orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
  symbol: { type: String, required: true },
  type: { type: String, enum: ['LONG', 'SHORT'], required: true },
  entryPrice: { type: Number, required: true },
  exitPrice: { type: Number },
  quantity: { type: Number, required: true },
  leverage: { type: Number, default: 1 },
  status: { type: String, enum: ['OPEN', 'CLOSED', 'CANCELLED'], required: true },
  pnl: { type: Number },
  pnlPercentage: { type: Number },
  entryTime: { type: Date, required: true },
  exitTime: { type: Date },
  stopLoss: { type: Number },
  takeProfit: { type: Number },
  metadata: { type: Schema.Types.Mixed },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

export const Trade = mongoose.model<ITrade>('Trade', tradeSchema); 