export interface StrategyExecutionRequest {
    strategyId: string;
    parameters: Record<string, any>;
}
export interface StrategyExecutionResponse {
    executionId: string;
    status: string;
    result?: any;
}
export interface IStrategy {
    id: string;
    name: string;
    description: string;
    parameters: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
export declare const getAllStrategies: () => Promise<StrategyExecutionResponse[]>;
export declare const getStrategyDetails: (executionId: string) => Promise<StrategyExecutionResponse>;
export declare const updateStrategyStatus: (executionId: string, status: string, result?: any) => Promise<void>;
export declare class StrategyService {
    private static instance;
    private constructor();
    static getInstance(): StrategyService;
    createStrategy(strategy: IStrategy): Promise<void>;
}
