import { Document, Types } from 'mongoose';
export interface IBacktest {
    _id: Types.ObjectId;
    userId: Types.ObjectId;
    strategyId: Types.ObjectId;
    name: string;
    description: string;
    period: {
        start: Date;
        end: Date;
    };
    parameters: Record<string, any>;
    results: {
        totalReturn: number;
        annualizedReturn: number;
        sharpeRatio: number;
        sortinoRatio: number;
        maxDrawdown: number;
        winRate: number;
        profitFactor: number;
        averageTrade: number;
        totalTrades: number;
        winningTrades: number;
        losingTrades: number;
    };
    status: 'running' | 'completed' | 'failed';
    error: string;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
export interface IBacktestDocument extends Omit<IBacktest, '_id'>, Document {
    _id: Types.ObjectId;
}
export type Backtest = IBacktest;
export interface BacktestCreateInput extends Omit<IBacktest, '_id' | 'createdAt' | 'updatedAt'> {
}
export interface BacktestUpdateInput extends Partial<BacktestCreateInput> {
}
//# sourceMappingURL=Backtest.d.ts.map