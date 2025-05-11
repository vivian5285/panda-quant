import mongoose, { Schema, Document, Types } from 'mongoose';
import { INetworkStatus } from '../types/Network';

export interface IHealth {
  _id: string;
  networkStatus: INetworkStatus;
  lastChecked: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IHealthDocument extends Document {
  _id: Types.ObjectId;
  networkStatus: INetworkStatus;
  lastChecked: Date;
  createdAt: Date;
  updatedAt: Date;
}

const healthSchema = new Schema<IHealthDocument>({
  networkStatus: {
    _id: { type: Schema.Types.ObjectId, required: true },
    network: { type: String, required: true },
    status: { type: String, enum: ['online', 'offline', 'error', 'checking'], required: true },
    lastChecked: { type: Date, required: true },
    latency: { type: Number, required: true },
    type: { type: String, enum: ['database', 'api', 'redis', 'websocket'], required: true },
    responseTime: { type: Number, required: true },
    error: { type: String },
    createdAt: { type: Date, required: true },
    updatedAt: { type: Date, required: true }
  },
  lastChecked: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

healthSchema.index({ status: 1 });
healthSchema.index({ lastChecked: -1 });
healthSchema.index({ createdAt: -1 });

export const Health = mongoose.model<IHealthDocument>('Health', healthSchema);
export default Health; 