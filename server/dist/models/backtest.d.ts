import { Document, Types } from 'mongoose';
export interface IBacktestDocument extends Document {
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
export declare const Backtest: import("mongoose").Model<IBacktestDocument, {}, {}, {}, Document<unknown, {}, IBacktestDocument, {}> & IBacktestDocument & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default Backtest;
