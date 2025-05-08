import { Document, Types } from 'mongoose';
export interface INetworkStatusBase {
    network: string;
    status: 'online' | 'offline' | 'error' | 'checking';
    lastChecked: Date;
    blockHeight?: number;
    latency: number;
    type: 'database' | 'api' | 'redis' | 'websocket';
    responseTime: number;
    error?: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface INetworkStatus extends INetworkStatusBase {
    _id: Types.ObjectId;
}
export interface INetworkStatusDocument extends INetworkStatusBase, Document {
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
export type NetworkStatus = INetworkStatus;
export interface NetworkStatusCreateInput extends Omit<INetworkStatus, '_id' | 'createdAt' | 'updatedAt'> {
}
export interface NetworkStatusUpdateInput extends Partial<NetworkStatusCreateInput> {
}
//# sourceMappingURL=Network.d.ts.map