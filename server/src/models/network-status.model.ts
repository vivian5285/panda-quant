import mongoose, { Schema, Document, Types } from 'mongoose';

export interface INetworkStatus {
  _id: Types.ObjectId;
  network: string;
  status: 'online' | 'offline' | 'error' | 'checking';
  lastChecked: Date;
  blockHeight?: number;
  latency: number;
  type: 'database' | 'api' | 'redis' | 'websocket';
  responseTime: number;
  error?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface INetworkStatusDocument extends Document {
  _id: Types.ObjectId;
  network: string;
  status: 'online' | 'offline' | 'error' | 'checking';
  lastChecked: Date;
  blockHeight?: number;
  latency: number;
  type: 'database' | 'api' | 'redis' | 'websocket';
  responseTime: number;
  error?: string;
  createdAt: Date;
  updatedAt: Date;
}

const networkStatusSchema = new Schema<INetworkStatusDocument>({
  network: { type: String, required: true },
  status: { type: String, enum: ['online', 'offline', 'error', 'checking'], required: true },
  lastChecked: { type: Date, required: true },
  blockHeight: { type: Number },
  latency: { type: Number, required: true },
  type: { type: String, enum: ['database', 'api', 'redis', 'websocket'], required: true },
  responseTime: { type: Number, required: true },
  error: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

networkStatusSchema.index({ network: 1 }, { unique: true });
networkStatusSchema.index({ status: 1 });
networkStatusSchema.index({ lastChecked: -1 });
networkStatusSchema.index({ createdAt: -1 });

export const NetworkStatus = mongoose.model<INetworkStatusDocument>('NetworkStatus', networkStatusSchema);
export default NetworkStatus; 