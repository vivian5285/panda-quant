/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose/types/inferschematype" />
/// <reference types="mongoose/types/inferrawdoctype" />
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