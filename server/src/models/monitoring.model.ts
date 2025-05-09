import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IMonitoring {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  strategyId: Types.ObjectId;
  type: 'performance' | 'risk' | 'system';
  status: 'active' | 'inactive' | 'triggered';
  threshold: number;
  condition: 'above' | 'below' | 'equals';
  notification: {
    email: boolean;
    telegram: boolean;
    push: boolean;
  };
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface IMonitoringDocument extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  strategyId: Types.ObjectId;
  type: 'performance' | 'risk' | 'system';
  status: 'active' | 'inactive' | 'triggered';
  threshold: number;
  condition: 'above' | 'below' | 'equals';
  notification: {
    email: boolean;
    telegram: boolean;
    push: boolean;
  };
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const monitoringSchema = new Schema<IMonitoringDocument>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  strategyId: { type: Schema.Types.ObjectId, ref: 'Strategy', required: true },
  type: { type: String, enum: ['performance', 'risk', 'system'], required: true },
  status: { type: String, enum: ['active', 'inactive', 'triggered'], required: true },
  threshold: { type: Number, required: true },
  condition: { type: String, enum: ['above', 'below', 'equals'], required: true },
  notification: {
    email: { type: Boolean, default: true },
    telegram: { type: Boolean, default: false },
    push: { type: Boolean, default: true }
  },
  metadata: { type: Schema.Types.Mixed, default: {} },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

monitoringSchema.index({ userId: 1 });
monitoringSchema.index({ strategyId: 1 });
monitoringSchema.index({ type: 1 });
monitoringSchema.index({ status: 1 });
monitoringSchema.index({ createdAt: -1 });

export const Monitoring = mongoose.model<IMonitoringDocument>('Monitoring', monitoringSchema); 