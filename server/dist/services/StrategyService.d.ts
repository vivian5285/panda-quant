import type { IStrategy, IStrategyDocument, StrategyCreateInput } from '../types/Strategy';
export declare enum StrategyStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    PAUSED = "paused"
}
export declare class StrategyService {
    private static instance;
    private constructor();
    static getInstance(): StrategyService;
    createStrategy(data: StrategyCreateInput): Promise<IStrategyDocument>;
    getStrategies(): Promise<IStrategyDocument[]>;
    getStrategy(id: string): Promise<IStrategyDocument | null>;
    updateStrategy(id: string, updates: Partial<IStrategy>): Promise<IStrategyDocument | null>;
    deleteStrategy(id: string): Promise<IStrategyDocument | null>;
    getStrategyPerformance(strategyId: string): Promise<any>;
    getAllStrategies(): Promise<IStrategyDocument[]>;
    getStrategiesByUser(userId: string): Promise<IStrategyDocument[]>;
    getActiveStrategies(): Promise<IStrategyDocument[]>;
    getPopularStrategies(limit?: number): Promise<IStrategyDocument[]>;
}
//# sourceMappingURL=StrategyService.d.ts.map