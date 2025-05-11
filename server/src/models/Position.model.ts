import mongoose, { Schema, Document, Types } from 'mongoose';
import { IPosition } from '../types/Position';

export interface IPositionDocument extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  strategyId: Types.ObjectId;
  symbol: string;
  quantity: number;
  entryPrice: number;
  currentPrice: number;
  unrealizedPnL: number;
  realizedPnL: number;
  status: 'open' | 'closed';
  type: 'long' | 'short';
  leverage: number;
  stopLoss?: number;
  takeProfit?: number;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const positionSchema = new Schema<IPositionDocument>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  strategyId: { type: Schema.Types.ObjectId, ref: 'Strategy', required: true },
  symbol: { type: String, required: true },
  quantity: { type: Number, required: true },
  entryPrice: { type: Number, required: true },
  currentPrice: { type: Number, required: true },
  unrealizedPnL: { type: Number, default: 0 },
  realizedPnL: { type: Number, default: 0 },
  status: { type: String, enum: ['open', 'closed'], default: 'open' },
  type: { type: String, enum: ['long', 'short'], required: true },
  leverage: { type: Number, default: 1 },
  stopLoss: { type: Number },
  takeProfit: { type: Number },
  metadata: { type: Schema.Types.Mixed, default: {} }
}, {
  timestamps: true
});

// 添加索引
positionSchema.index({ userId: 1 });
positionSchema.index({ strategyId: 1 });
positionSchema.index({ symbol: 1 });
positionSchema.index({ status: 1 });
positionSchema.index({ type: 1 });
positionSchema.index({ createdAt: -1 });

export const PositionModel = mongoose.model<IPositionDocument>('Position', positionSchema);
export default PositionModel; 