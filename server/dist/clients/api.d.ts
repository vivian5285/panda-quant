import { StrategyExecutionRequest, StrategyExecutionResponse, UserApiResponse } from '../types/Api';
export declare const userApi: import("axios").AxiosInstance;
export declare const adminApi: import("axios").AxiosInstance;
export declare const strategyEngineApi: import("axios").AxiosInstance;
export declare const executeStrategy: (request: StrategyExecutionRequest) => Promise<StrategyExecutionResponse>;
export declare const getUserInfo: (userId: string) => Promise<UserApiResponse>;
export declare const updateStrategyStatus: (executionId: string, status: string, result?: any) => Promise<void>;
