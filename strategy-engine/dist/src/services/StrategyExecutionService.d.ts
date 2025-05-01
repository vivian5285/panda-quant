import { Order } from '../types/order';
export interface StrategyExecutionResult {
    executionId: string;
    status: 'success' | 'failed';
    message: string;
    currentReturn?: number;
    maxDrawdown?: number;
    dailyReturn?: number;
    totalTrades?: number;
    winRate?: number;
    trades: Order[];
}
export declare class StrategyExecutionService {
    private static instance;
    private commissionService;
    private monitorService;
    private constructor();
    static getInstance(): StrategyExecutionService;
    executeStrategy(strategyId: string, parameters: Record<string, any>): Promise<StrategyExecutionResult>;
    private runStrategy;
    private generateExecutionId;
}
