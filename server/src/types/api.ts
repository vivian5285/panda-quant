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

export interface IApiRequest<T> {
  data: T;
  timestamp: number;
  signature?: string;
}

export interface IApiPagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface IApiPaginationResponse<T> extends IApiResponse<T> {
  pagination: IApiPagination;
}

export interface IApiValidationError {
  field: string;
  message: string;
  code: string;
}

export interface IApiValidationResponse {
  success: boolean;
  errors: IApiValidationError[];
  message?: string;
}

export interface IApiConfig {
  baseUrl: string;
  timeout: number;
  headers?: Record<string, string>;
  auth?: {
    type: 'basic' | 'bearer' | 'apiKey';
    credentials?: string;
    key?: string;
    value?: string;
  };
}

export interface IApiClient {
  get<T>(url: string, config?: IApiConfig): Promise<IApiResponse<T>>;
  post<T>(url: string, data: any, config?: IApiConfig): Promise<IApiResponse<T>>;
  put<T>(url: string, data: any, config?: IApiConfig): Promise<IApiResponse<T>>;
  delete<T>(url: string, config?: IApiConfig): Promise<IApiResponse<T>>;
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