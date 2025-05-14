import { Schema, model } from 'mongoose';
import { INetworkStatus } from '../types';

const NetworkStatusSchema = new Schema<INetworkStatus>({
  id: { type: String, required: true },
  status: { type: String, required: true, enum: ['online', 'offline'] },
  latency: { type: Number, required: true },
  lastChecked: { type: Date, required: true },
  network: { type: String, required: true }
});

export default model<INetworkStatus>('NetworkStatus', NetworkStatusSchema); 