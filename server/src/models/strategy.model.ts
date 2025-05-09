import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IStrategy {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  name: string;
  description: string;
  type: 'manual' | 'automated';
  status: 'active' | 'inactive' | 'deleted';
  config: {
    tradingPairs: string[];
    timeframe: string;
    riskLevel: 'low' | 'medium' | 'high';
    maxPositions: number;
    maxDrawdown: number;
    stopLoss: number;
    takeProfit: number;
  };
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface IStrategyDocument extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  name: string;
  description: string;
  type: 'manual' | 'automated';
  status: 'active' | 'inactive' | 'deleted';
  config: {
    tradingPairs: string[];
    timeframe: string;
    riskLevel: 'low' | 'medium' | 'high';
    maxPositions: number;
    maxDrawdown: number;
    stopLoss: number;
    takeProfit: number;
  };
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const strategySchema = new Schema<IStrategyDocument>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, enum: ['manual', 'automated'], required: true },
  status: { type: String, enum: ['active', 'inactive', 'deleted'], required: true },
  config: {
    tradingPairs: [{ type: String, required: true }],
    timeframe: { type: String, required: true },
    riskLevel: { type: String, enum: ['low', 'medium', 'high'], required: true },
    maxPositions: { type: Number, required: true },
    maxDrawdown: { type: Number, required: true },
    stopLoss: { type: Number, required: true },
    takeProfit: { type: Number, required: true }
  },
  metadata: { type: Schema.Types.Mixed, default: {} },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

strategySchema.index({ userId: 1 });
strategySchema.index({ name: 1 });
strategySchema.index({ type: 1 });
strategySchema.index({ status: 1 });
strategySchema.index({ 'config.tradingPairs': 1 });
strategySchema.index({ 'config.timeframe': 1 });
strategySchema.index({ createdAt: -1 });

export const Strategy = mongoose.model<IStrategyDocument>('Strategy', strategySchema);
export default Strategy; 