import { Document, Types } from 'mongoose';
import { NetworkStatus } from './Enums';

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

export type HealthCreateInput = Omit<IHealthBase, 'timestamp'> & {
  timestamp?: Date;
};

export type HealthUpdateInput = Partial<Omit<IHealthBase, 'version' | 'uptime'>>; 