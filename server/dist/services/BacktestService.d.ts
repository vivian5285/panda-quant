import { Types } from 'mongoose';
export interface IBacktest {
    _id: Types.ObjectId;
    strategyId: Types.ObjectId;
    userId: Types.ObjectId;
    startDate: Date;
    endDate: Date;
    initialBalance: number;
    finalBalance: number;
    totalReturn: number;
    annualizedReturn: number;
    sharpeRatio: number;
    maxDrawdown: number;
    winRate: number;
    profitFactor: number;
    averageTrade: number;
    totalTrades: number;
    winningTrades: number;
    losingTrades: number;
    createdAt: Date;
    updatedAt: Date;
}
export declare class BacktestService {
    createBacktest(data: Omit<IBacktest, '_id' | 'createdAt' | 'updatedAt'>): Promise<IBacktest>;
    getBacktestById(id: string): Promise<IBacktest | null>;
    getBacktestsByStrategyId(strategyId: string): Promise<IBacktest[]>;
    updateBacktest(id: string, data: Partial<IBacktest>): Promise<IBacktest | null>;
    deleteBacktest(id: string): Promise<boolean>;
}
