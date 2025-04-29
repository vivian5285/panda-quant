import { Document } from 'mongoose';

export interface INetworkStatus extends Document {
  _id: string;
  type: 'api' | 'database' | 'redis' | 'websocket';
  status: 'up' | 'down' | 'degraded';
  lastChecked: Date;
  responseTime: number;
  error?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type NetworkStatus = INetworkStatus;

export interface NetworkStatusCreateInput extends Omit<INetworkStatus, '_id' | 'createdAt' | 'updatedAt'> {}
export interface NetworkStatusUpdateInput extends Partial<NetworkStatusCreateInput> {}

export interface NetworkConfig {
  name: string;
  chainId: number | null;
  rpcUrl: string;
  explorerUrl: string;
  symbol: string;
} 