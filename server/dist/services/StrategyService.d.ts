import { IStrategy, IStrategyCreateInput, IStrategyUpdateInput } from '../types/Strategy';
import { ITrade } from '../types/Trade';
export declare class StrategyService {
    private static instance;
    private constructor();
    static getInstance(): StrategyService;
    private convertToITrade;
    private convertToIStrategy;
    createStrategy(strategyData: IStrategyCreateInput): Promise<IStrategy>;
    getStrategyById(id: string): Promise<IStrategy | null>;
    updateStrategy(id: string, updates: IStrategyUpdateInput): Promise<IStrategy | null>;
    deleteStrategy(id: string): Promise<boolean>;
    getAllStrategies(): Promise<IStrategy[]>;
    startStrategy(strategy: IStrategy): Promise<void>;
    stopStrategy(strategy: IStrategy): Promise<void>;
    pauseStrategy(strategy: IStrategy): Promise<void>;
    resumeStrategy(strategy: IStrategy): Promise<void>;
    getStrategiesByUser(userId: string): Promise<IStrategy[]>;
    getActiveStrategies(): Promise<IStrategy[]>;
    getPopularStrategies(limit?: number): Promise<IStrategy[]>;
    getTradesByStrategyId(strategyId: string): Promise<ITrade[]>;
}
//# sourceMappingURL=StrategyService.d.ts.map