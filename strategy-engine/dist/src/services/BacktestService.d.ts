import { BacktestParams, BacktestResult } from '../types/backtest';
export declare class BacktestService {
    private static instance;
    private historicalData;
    private constructor();
    static getInstance(): BacktestService;
    private initializeHistoricalData;
    private loadHistoricalData;
    runBacktest(strategyId: string, params: BacktestParams): Promise<BacktestResult>;
    private executeBacktest;
}
