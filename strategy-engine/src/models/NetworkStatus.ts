import { Schema, model } from 'mongoose';
import { INetworkStatus } from '../types';

const networkStatusSchema = new Schema<INetworkStatus>({
  network: { type: String, required: true },
  type: { type: String, required: true, enum: ['database', 'api', 'redis', 'websocket'] },
  status: { type: String, required: true, enum: ['online', 'offline', 'checking', 'error'] },
  lastChecked: { type: Date, required: true },
  responseTime: { type: Number, required: true },
  blockHeight: { type: Number },
  error: { type: String },
}, {
  timestamps: true
});

export default model<INetworkStatus>('NetworkStatus', networkStatusSchema); 