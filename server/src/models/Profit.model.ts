import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IProfit {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  strategyId: Types.ObjectId;
  amount: number;
  currency: string;
  type: 'realized' | 'unrealized';
  status: 'pending' | 'completed' | 'failed';
  description: string;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface IProfitDocument extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  strategyId: Types.ObjectId;
  amount: number;
  currency: string;
  type: 'realized' | 'unrealized';
  status: 'pending' | 'completed' | 'failed';
  description: string;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const profitSchema = new Schema<IProfitDocument>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  strategyId: { type: Schema.Types.ObjectId, ref: 'Strategy', required: true },
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  type: { type: String, enum: ['realized', 'unrealized'], required: true },
  status: { type: String, enum: ['pending', 'completed', 'failed'], required: true },
  description: { type: String, required: true },
  metadata: { type: Schema.Types.Mixed, default: {} },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// 添加索引
profitSchema.index({ userId: 1 });
profitSchema.index({ strategyId: 1 });
profitSchema.index({ type: 1 });
profitSchema.index({ status: 1 });
profitSchema.index({ currency: 1 });
profitSchema.index({ createdAt: -1 });

export const Profit = mongoose.model<IProfitDocument>('Profit', profitSchema);
export default Profit; 