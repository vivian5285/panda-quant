import { Schema, model, Document, Types } from 'mongoose';
import { INetworkStatus } from '../types/network';

export interface INetworkStatusDocument extends Omit<INetworkStatus, '_id'>, Document {
  _id: Types.ObjectId;
}

const NetworkStatusSchema = new Schema<INetworkStatusDocument>({
  network: { type: String, required: true },
  status: { type: String, required: true, enum: ['online', 'offline', 'error', 'checking'] },
  lastChecked: { type: Date, default: Date.now },
  blockHeight: { type: Number },
  latency: { type: Number, required: true },
  type: { type: String, required: true, enum: ['database', 'api', 'redis', 'websocket'] },
  responseTime: { type: Number, required: true },
  error: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default model<INetworkStatusDocument>('NetworkStatus', NetworkStatusSchema); 