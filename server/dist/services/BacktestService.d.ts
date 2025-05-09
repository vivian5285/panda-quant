import { IBacktest, BacktestCreateInput } from '../types/Backtest';
export declare class BacktestService {
    private static instance;
    private constructor();
    static getInstance(): BacktestService;
    private convertToIBacktest;
    createBacktest(backtestData: BacktestCreateInput): Promise<IBacktest>;
    getBacktestById(id: string): Promise<IBacktest | null>;
    getBacktestsByUserId(userId: string): Promise<IBacktest[]>;
    getBacktestByStrategyId(strategyId: string): Promise<IBacktest | null>;
}
//# sourceMappingURL=BacktestService.d.ts.map