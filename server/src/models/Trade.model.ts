import mongoose, { Schema, Document, Types } from 'mongoose';
import { ITradeBase } from '../types/Trading';

export interface ITradeDocument extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  strategyId: Types.ObjectId;
  orderId: Types.ObjectId;
  symbol: string;
  type: 'LONG' | 'SHORT';
  side: 'BUY' | 'SELL';
  quantity: number;
  entryPrice: number;
  exitPrice?: number;
  leverage: number;
  status: 'OPEN' | 'CLOSED' | 'CANCELLED' | 'PENDING' | 'FAILED';
  pnl?: number;
  pnlPercentage?: number;
  entryTime: Date;
  exitTime?: Date;
  stopLoss?: number;
  takeProfit?: number;
  executedAt?: Date;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const tradeSchema = new Schema<ITradeDocument>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  strategyId: { type: Schema.Types.ObjectId, ref: 'Strategy', required: true },
  orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
  symbol: { type: String, required: true },
  type: { type: String, enum: ['LONG', 'SHORT'], required: true },
  side: { type: String, enum: ['BUY', 'SELL'], required: true },
  quantity: { type: Number, required: true },
  entryPrice: { type: Number, required: true },
  exitPrice: { type: Number },
  leverage: { type: Number, default: 1 },
  status: { type: String, enum: ['OPEN', 'CLOSED', 'CANCELLED', 'PENDING', 'FAILED'], required: true },
  pnl: { type: Number },
  pnlPercentage: { type: Number },
  entryTime: { type: Date, required: true },
  exitTime: { type: Date },
  stopLoss: { type: Number },
  takeProfit: { type: Number },
  executedAt: { type: Date },
  metadata: { type: Schema.Types.Mixed, default: {} }
}, {
  timestamps: true
});

// 添加索引
tradeSchema.index({ userId: 1 });
tradeSchema.index({ strategyId: 1 });
tradeSchema.index({ orderId: 1 });
tradeSchema.index({ symbol: 1 });
tradeSchema.index({ status: 1 });
tradeSchema.index({ createdAt: -1 });
tradeSchema.index({ entryTime: -1 });

export const TradeModel = mongoose.model<ITradeDocument>('Trade', tradeSchema);
export default TradeModel; 