export interface IApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}
export interface IApiError {
    code: string;
    message: string;
    details?: any;
}
export interface IApiRequest {
    method: string;
    url: string;
    headers?: Record<string, string>;
    body?: any;
    params?: Record<string, any>;
}
export interface UserApiResponse {
    success: boolean;
    data?: any;
    error?: string;
}
export interface StrategyEngineResponse {
    success: boolean;
    data?: any;
    error?: string;
}
export interface ServerResponse {
    success: boolean;
    data?: any;
    error?: string;
}
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
        userApi: boolean;
        adminApi: boolean;
        strategyEngine: boolean;
    };
}
