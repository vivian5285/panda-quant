import { NetworkStatus, NetworkType } from './Enums';

export interface INetwork {
  _id: string;
  name: string;
  type: NetworkType;
  status: NetworkStatus;
  config: {
    host: string;
    port: number;
    username: string;
    password: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface INetworkStatus {
  _id: string;
  networkId: string;
  status: NetworkStatus;
  lastCheck: Date;
  latency: number;
  error?: string;
  createdAt: Date;
  updatedAt: Date;
} 