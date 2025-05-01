import { IStrategy } from '../types/strategy';
export declare enum StrategyStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    PAUSED = "paused"
}
export declare class StrategyService {
    private static instance;
    private constructor();
    static getInstance(): StrategyService;
    createStrategy(strategy: Partial<IStrategy>): Promise<IStrategy>;
    getStrategies(userId: string): Promise<IStrategy[]>;
    getStrategy(id: string): Promise<IStrategy | null>;
    updateStrategy(id: string, updates: Partial<IStrategy>): Promise<IStrategy | null>;
    deleteStrategy(id: string): Promise<IStrategy | null>;
    getStrategyPerformance(strategyId: string): Promise<any>;
    getAllStrategies(): Promise<IStrategy[]>;
    getStrategiesByUser(userId: string): Promise<IStrategy[]>;
    getActiveStrategies(): Promise<IStrategy[]>;
    getPopularStrategies(limit?: number): Promise<IStrategy[]>;
}
