import { Schema, model, Types } from 'mongoose';
import { NetworkStatus } from '../types/Enums';

export interface IHealthBase {
  status: NetworkStatus;
  timestamp: Date;
  services: Record<string, {
    status: NetworkStatus;
    latency?: number;
    responseTime?: number;
  }>;
  version: string;
  uptime: number;
}

export interface IHealth extends IHealthBase {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface IHealthDocument extends IHealth {
  _id: Types.ObjectId;
}

const healthSchema = new Schema<IHealthDocument>({
  status: {
    type: String,
    enum: Object.values(NetworkStatus),
    required: true
  },
  timestamp: {
    type: Date,
    required: true
  },
  services: {
    type: Map,
    of: {
      status: {
        type: String,
        enum: Object.values(NetworkStatus),
        required: true
      },
      latency: Number,
      responseTime: Number
    },
    required: true
  },
  version: {
    type: String,
    required: true
  },
  uptime: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

export const Health = model<IHealthDocument>('Health', healthSchema);
export default Health; 