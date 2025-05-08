import { Document, Types } from 'mongoose';
export interface IBacktest {
    userId: Types.ObjectId;
    strategyId: Types.ObjectId;
    name: string;
    description?: string;
    startDate: Date;
    endDate: Date;
    initialBalance: number;
    finalBalance: number;
    totalReturn: number;
    annualizedReturn: number;
    averageTrade: number;
    trades: Array<{
        symbol: string;
        type: 'long' | 'short';
        entryPrice: number;
        exitPrice: number;
        quantity: number;
        profit: number;
        timestamp: Date;
    }>;
    parameters: Record<string, any>;
    status: 'running' | 'completed' | 'failed';
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