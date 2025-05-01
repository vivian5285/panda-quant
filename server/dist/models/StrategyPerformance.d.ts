import { Document } from 'mongoose';
export interface IStrategyPerformance {
    strategyId: string;
    period: {
        start: Date;
        end: Date;
    };
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
}
export interface IStrategyPerformanceDocument extends Document {
    strategyId: string;
    period: {
        start: Date;
        end: Date;
    };
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
    createdAt: Date;
    updatedAt: Date;
}
export declare const StrategyPerformance: import("mongoose").Model<IStrategyPerformanceDocument, {}, {}, {}, Document<unknown, {}, IStrategyPerformanceDocument, {}> & IStrategyPerformanceDocument & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default StrategyPerformance;
