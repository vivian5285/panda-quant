import { Schema, model, Types } from 'mongoose';
import { INetworkStatus, INetworkStatusDocument } from '../types/Network';
import { NetworkStatus, NetworkType } from '../types/Enums';

const networkStatusSchema = new Schema<INetworkStatusDocument>({
  network: {
    type: String,
    required: true,
    unique: true
  },
  status: {
    type: String,
    enum: Object.values(NetworkStatus),
    required: true
  },
  lastCheck: {
    type: Date,
    required: true
  },
  latency: {
    type: Number
  },
  type: {
    type: String,
    enum: Object.values(NetworkType),
    required: true
  },
  responseTime: {
    type: Number
  },
  error: {
    type: String
  }
}, {
  timestamps: true
});

export const NetworkStatusModel = model<INetworkStatusDocument>('NetworkStatus', networkStatusSchema);
export default NetworkStatusModel; 