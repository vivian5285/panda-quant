import { Document, Types } from 'mongoose';

export interface IMonitoring extends Document {
  strategyId: Types.ObjectId;
  status: string;
  lastCheck: Date;
  metrics: {
    cpu: number;
    memory: number;
    latency: number;
    errorRate: number;
  };
  alerts: Array<{
    type: string;
    message: string;
    timestamp: Date;
    severity: 'low' | 'medium' | 'high';
  }>;
  createdAt: Date;
  updatedAt: Date;
} 