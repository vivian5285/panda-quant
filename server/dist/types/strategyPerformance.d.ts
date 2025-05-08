import { Document, Types } from 'mongoose';
export interface IStrategyPerformance {
    _id: Types.ObjectId;
    strategyId: Types.ObjectId;
    userId: Types.ObjectId;
    totalTrades: number;
    winRate: number;
    profitFactor: number;
    averageTrade: number;
    totalProfit: number;
    maxDrawdown: number;
    sharpeRatio: number;
    sortinoRatio: number;
    createdAt: Date;
    updatedAt: Date;
}
export interface IStrategyPerformanceDocument extends IStrategyPerformance, Document {
    _id: Types.ObjectId;
}
export interface IStrategyPerformanceMetrics {
    totalProfit: number;
    totalLoss: number;
    winRate: number;
    averageProfit: number;
    averageLoss: number;
}
//# sourceMappingURL=StrategyPerformance.d.ts.map