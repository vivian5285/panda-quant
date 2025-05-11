import { Types } from 'mongoose';
import { NetworkStatus, NetworkType } from './Enums';

export interface INetworkStatusBase {
  network: string;
  status: NetworkStatus;
  lastCheck: Date;
  latency?: number;
  type: NetworkType;
  responseTime?: number;
  error?: string;
}

export interface INetworkStatus extends INetworkStatusBase {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface INetworkStatusDocument extends INetworkStatus {
  _id: Types.ObjectId;
}

export interface NetworkConfig {
  name: string;
  type: 'database' | 'api' | 'redis' | 'websocket';
  url: string;
  timeout: number;
  retryCount: number;
  retryDelay: number;
}

export type NetworkStatusCreateInput = Omit<INetworkStatusBase, 'lastCheck'> & {
  lastCheck?: Date;
};

export type NetworkStatusUpdateInput = Partial<Omit<INetworkStatusBase, 'network' | 'type'>>; 