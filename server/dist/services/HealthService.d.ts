import { INetworkStatus } from '../types/Network';
import { EventEmitter } from 'events';
import { IHealth } from '../types/Health';
export interface HealthCheckResult {
    status: 'healthy' | 'unhealthy';
    error?: string;
}
type NetworkComponent = 'database' | 'api' | 'redis' | 'websocket' | 'userApi' | 'adminApi' | 'strategyEngine';
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
    checkHealth(): Promise<{
        status: 'healthy' | 'degraded' | 'unhealthy';
        components: Record<NetworkComponent, {
            status: 'online' | 'offline';
            message?: string;
        }>;
    }>;
    private checkDatabase;
    private checkApi;
    private checkRedis;
    private checkWebSocket;
    private determineOverallStatus;
    updateNetworkComponentStatus(type: NetworkComponent, status: 'online' | 'offline', error?: string, responseTime?: number): Promise<void>;
    getNetworkStatus(): Promise<INetworkStatus[]>;
    createHealth(data: Omit<IHealth, '_id' | 'createdAt' | 'updatedAt'>): Promise<IHealth>;
    getHealthById(id: string): Promise<IHealth | null>;
    updateHealth(id: string, data: Partial<IHealth>): Promise<IHealth | null>;
    deleteHealth(id: string): Promise<boolean>;
    checkDatabaseConnection(): Promise<boolean>;
    getHealth(): Promise<IHealth>;
    updateHealthStatus(data: Partial<IHealth>): Promise<IHealth>;
    updateHealthWithNetworkStatus(networkStatus: INetworkStatus): Promise<IHealth>;
    private mapToIHealth;
}
export declare const healthService: HealthService;
export {};
//# sourceMappingURL=HealthService.d.ts.map