import { Schema, model, Document, Types } from 'mongoose';
import { StrategyStatus, StrategyType } from '../types/Enums';

export interface IStrategy {
  userId: Types.ObjectId;
  name: string;
  description: string;
  type: StrategyType;
  status: StrategyStatus;
  parameters: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface IStrategyDocument extends IStrategy, Document {}

const strategySchema = new Schema<IStrategyDocument>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, enum: Object.values(StrategyType), required: true },
  status: { type: String, enum: Object.values(StrategyStatus), default: StrategyStatus.PENDING },
  parameters: { type: Schema.Types.Mixed, default: {} },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// 添加中间件来自动更新updatedAt字段
strategySchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// 添加索引
strategySchema.index({ type: 1 });
strategySchema.index({ status: 1 });
strategySchema.index({ createdAt: -1 });
strategySchema.index({ userId: 1 });

export const Strategy = model<IStrategyDocument>('Strategy', strategySchema);
export default Strategy; 