import { IStrategy } from '../types/Strategy';
import { ITrade } from '../types/Trading';
export declare class StrategyService {
    private static instance;
    private constructor();
    static getInstance(): StrategyService;
    createStrategy(strategyData: Partial<IStrategy>): Promise<IStrategy>;
    getStrategyById(id: string): Promise<IStrategy | null>;
    updateStrategy(id: string, updates: Partial<IStrategy>): Promise<IStrategy | null>;
    deleteStrategy(id: string): Promise<boolean>;
    getAllStrategies(): Promise<IStrategy[]>;
    startStrategy(strategy: IStrategy): Promise<void>;
    stopStrategy(strategy: IStrategy): Promise<void>;
    pauseStrategy(strategy: IStrategy): Promise<void>;
    resumeStrategy(strategy: IStrategy): Promise<void>;
    getStrategiesByUser(userId: string): Promise<IStrategy[]>;
    getActiveStrategies(): Promise<IStrategy[]>;
    getPopularStrategies(limit?: number): Promise<IStrategy[]>;
    getStrategyTrades(strategyId: string): Promise<ITrade[]>;
}
//# sourceMappingURL=StrategyService.d.ts.map