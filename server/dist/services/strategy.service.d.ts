import { IStrategy, IStrategyDocument } from '../types/strategy';
import { StrategyStatus } from '../types/enums';
export declare class StrategyService {
    private strategyModel;
    constructor();
    getStrategies(userId: string): Promise<IStrategyDocument[]>;
    getStrategy(id: string, userId: string): Promise<IStrategyDocument | null>;
    createStrategy(userId: string, data: Partial<IStrategy>): Promise<IStrategyDocument>;
    updateStrategy(id: string, userId: string, data: Partial<IStrategy>): Promise<IStrategyDocument | null>;
    deleteStrategy(id: string, userId: string): Promise<IStrategyDocument | null>;
    getStrategiesByStatus(userId: string, status: StrategyStatus): Promise<IStrategyDocument[]>;
    getStrategiesByType(userId: string, type: string): Promise<IStrategyDocument[]>;
    getStrategySummary(userId: string): Promise<{
        totalStrategies: number;
        activeStrategies: number;
        totalProfit: number;
    }>;
    getStrategyPerformance(id: string, userId: string): Promise<any>;
}
