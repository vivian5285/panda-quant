export interface StrategyExecutionRequest {
    strategyId: string;
    userId: string;
    parameters: Record<string, any>;
}
export interface StrategyExecutionResponse {
    executionId: string;
    status: 'pending' | 'running' | 'completed' | 'failed';
    result?: any;
    error?: string;
}
export interface HealthCheckResponse {
    status: 'ok' | 'error';
    services: {
        database: boolean;
        redis: boolean;
        server: boolean;
    };
}
export interface StrategyStatusUpdate {
    executionId: string;
    status: 'pending' | 'running' | 'completed' | 'failed';
    result?: any;
    error?: string;
}
