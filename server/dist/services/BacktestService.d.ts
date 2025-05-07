import { IBacktest } from '../types/Backtest';
export declare class BacktestService {
    createBacktest(data: Omit<IBacktest, '_id' | 'createdAt' | 'updatedAt'>): Promise<IBacktest>;
    getBacktestById(id: string): Promise<IBacktest | null>;
    getBacktestsByStrategyId(strategyId: string): Promise<IBacktest[]>;
    updateBacktest(id: string, data: Partial<IBacktest>): Promise<IBacktest | null>;
    deleteBacktest(id: string): Promise<boolean>;
}
//# sourceMappingURL=BacktestService.d.ts.map