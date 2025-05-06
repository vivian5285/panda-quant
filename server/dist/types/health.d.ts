import { INetworkStatus } from './Network';
export interface IHealth {
    _id: string;
    networkStatus: INetworkStatus;
    lastChecked: Date;
    createdAt: Date;
    updatedAt: Date;
}
