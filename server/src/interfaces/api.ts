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