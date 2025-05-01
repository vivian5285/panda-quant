import { Schema, model } from 'mongoose';
import { IPosition } from '../types/position';

const positionSchema = new Schema<IPosition>({
  userId: { type: String, required: true },
  symbol: { type: String, required: true },
  quantity: { type: Number, required: true },
  entryPrice: { type: Number, required: true },
  currentPrice: { type: Number, required: true },
  unrealizedPnL: { type: Number, default: 0 },
  realizedPnL: { type: Number, default: 0 },
  status: { type: String, enum: ['open', 'closed'], default: 'open' }
}, {
  timestamps: true
});

// 添加索引
positionSchema.index({ userId: 1 });
positionSchema.index({ symbol: 1 });
positionSchema.index({ status: 1 });
positionSchema.index({ createdAt: -1 });

export const Position = model<IPosition>('Position', positionSchema); 