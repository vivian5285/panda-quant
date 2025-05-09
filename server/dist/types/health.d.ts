import { INetworkStatus } from './Network';
export interface IHealth {
    _id: string;
    networkStatus: INetworkStatus;
    lastChecked: Date;
    createdAt: Date;
    updatedAt: Date;
}
export interface HealthCreateInput extends Omit<IHealth, '_id' | 'createdAt' | 'updatedAt'> {
}
export interface HealthUpdateInput extends Partial<HealthCreateInput> {
}
//# sourceMappingURL=Health.d.ts.map