import { INetworkStatus } from '../interfaces/INetworkStatus';
import { EventEmitter } from 'events';
import { HealthService } from './HealthService';
export interface HealthCheckResult {
    status: 'healthy' | 'unhealthy';
    error?: string;
}
export declare const healthService: HealthService;
export declare class HealthService extends EventEmitter {
    private networkStatusModel;
    private static instance;
    private status;
    private constructor();
    static getInstance(): HealthService;
    private initializeStatus;
    setDatabaseStatus(isHealthy: boolean): void;
    setRedisStatus(isHealthy: boolean): void;
    setApiStatus(isHealthy: boolean): void;
    getDatabaseStatus(): boolean;
    getRedisStatus(): boolean;
    getApiStatus(): boolean;
    getOverallStatus(): boolean;
    getAllStatus(): Record<string, boolean>;
    checkDatabaseHealth(): Promise<HealthCheckResult>;
    checkRedisHealth(): Promise<boolean>;
    checkUserApiHealth(): Promise<HealthCheckResult>;
    checkAdminApiHealth(): Promise<HealthCheckResult>;
    checkStrategyEngineHealth(): Promise<HealthCheckResult>;
    updateNetworkStatus(type: INetworkStatus['type'], status: INetworkStatus['status'], error?: string): Promise<void>;
    getNetworkStatus(): Promise<INetworkStatus[]>;
}
