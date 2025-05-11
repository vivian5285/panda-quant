import { IStrategy, IStrategyCreateInput, IStrategyUpdateInput } from '../types/Strategy';
export declare class StrategyService {
    private static instance;
    private constructor();
    static getInstance(): StrategyService;
    createStrategy(strategyData: IStrategyCreateInput): Promise<IStrategy>;
    getStrategyById(id: string): Promise<IStrategy | null>;
    getStrategyByUserId(userId: string): Promise<IStrategy | null>;
    updateStrategy(id: string, strategyData: IStrategyUpdateInput): Promise<IStrategy | null>;
    deleteStrategy(id: string): Promise<boolean>;
    getAllStrategies(): Promise<IStrategy[]>;
}
//# sourceMappingURL=strategy.service.d.ts.map