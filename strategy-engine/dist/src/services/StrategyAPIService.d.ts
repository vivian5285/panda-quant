import { StrategyPerformance } from './StrategyMonitorService';
export interface StrategyExecutionRequest {
    strategyId: string;
    userId: string;
    parameters: Record<string, any>;
}
export interface StrategyExecutionResponse {
    executionId: string;
    status: 'success' | 'failed';
    message: string;
    performance?: StrategyPerformance;
}
export declare class StrategyAPIService {
    private static instance;
    private monitorService;
    private executionService;
    private riskService;
    private constructor();
    static getInstance(): StrategyAPIService;
    executeStrategy(request: StrategyExecutionRequest): Promise<StrategyExecutionResponse>;
    getStrategyPerformance(strategyId: string, userId: string): StrategyPerformance | undefined;
    getAllStrategyPerformances(userId?: string): StrategyPerformance[];
    subscribeToStrategyUpdates(strategyId: string, userId: string, callback: (performance: StrategyPerformance) => void): void;
    unsubscribeFromStrategyUpdates(strategyId: string, userId: string): void;
}
