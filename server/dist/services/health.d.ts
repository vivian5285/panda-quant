export declare const checkDatabaseHealth: () => Promise<boolean>;
export declare const checkRedisHealth: () => Promise<boolean>;
export declare const checkUserApiHealth: () => Promise<boolean>;
export declare const checkAdminApiHealth: () => Promise<boolean>;
export interface HealthCheckResult {
    status: 'healthy' | 'unhealthy';
    error?: string;
}
export declare function checkStrategyEngineHealth(): Promise<HealthCheckResult>;
export declare const healthService: any;
