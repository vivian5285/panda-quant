import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IAlert {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  strategyId: Types.ObjectId;
  type: 'price' | 'indicator' | 'system';
  condition: 'above' | 'below' | 'equals';
  value: number;
  symbol: string;
  message: string;
  status: 'active' | 'triggered' | 'inactive';
  notification: {
    email: boolean;
    telegram: boolean;
    push: boolean;
  };
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAlertDocument extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  strategyId: Types.ObjectId;
  type: 'price' | 'indicator' | 'system';
  condition: 'above' | 'below' | 'equals';
  value: number;
  symbol: string;
  message: string;
  status: 'active' | 'triggered' | 'inactive';
  notification: {
    email: boolean;
    telegram: boolean;
    push: boolean;
  };
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const alertSchema = new Schema<IAlertDocument>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  strategyId: { type: Schema.Types.ObjectId, ref: 'Strategy', required: true },
  type: { type: String, enum: ['price', 'indicator', 'system'], required: true },
  condition: { type: String, enum: ['above', 'below', 'equals'], required: true },
  value: { type: Number, required: true },
  symbol: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ['active', 'triggered', 'inactive'], required: true },
  notification: {
    email: { type: Boolean, default: true },
    telegram: { type: Boolean, default: false },
    push: { type: Boolean, default: true }
  },
  metadata: { type: Schema.Types.Mixed, default: {} },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// 添加索引
alertSchema.index({ userId: 1 });
alertSchema.index({ strategyId: 1 });
alertSchema.index({ type: 1 });
alertSchema.index({ status: 1 });
alertSchema.index({ symbol: 1 });
alertSchema.index({ createdAt: -1 });
alertSchema.index({ updatedAt: -1 });

export const Alert = mongoose.model<IAlertDocument>('Alert', alertSchema);
export default Alert; 