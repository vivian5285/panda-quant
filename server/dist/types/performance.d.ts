import type { Document, Types } from 'mongoose';
import type { ReportPeriod } from './Enums';
export interface PerformanceMetrics {
    totalTrades: number;
    winningTrades: number;
    losingTrades: number;
    winRate: number;
    profitFactor: number;
    averageWin: number;
    averageLoss: number;
    largestWin: number;
    largestLoss: number;
    averageHoldingTime: number;
    sharpeRatio: number;
    sortinoRatio: number;
    maxDrawdown: number;
    maxDrawdownDuration: number;
    totalReturn: number;
    annualizedReturn: number;
    volatility: number;
    beta: number;
    alpha: number;
    informationRatio: number;
    calmarRatio: number;
    treynorRatio: number;
    ulcerIndex: number;
    valueAtRisk: number;
    expectedShortfall: number;
    createdAt: Date;
    updatedAt: Date;
}
export interface PerformanceTrade {
    tradeId: Types.ObjectId;
    symbol: string;
    entryPrice: number;
    exitPrice: number;
    quantity: number;
    pnl: number;
    pnlPercentage: number;
    entryTime: Date;
    exitTime: Date;
    holdingTime: number;
    commission: number;
    slippage: number;
    metadata?: Record<string, any>;
}
export interface PerformancePeriod {
    startDate: Date;
    endDate: Date;
    metrics: PerformanceMetrics;
    trades: PerformanceTrade[];
}
export interface StrategyPerformanceBase {
    strategyId: Types.ObjectId;
    userId: Types.ObjectId;
    period: ReportPeriod;
    startDate: Date;
    endDate: Date;
    metrics: PerformanceMetrics;
    trades: PerformanceTrade[];
    createdAt: Date;
    updatedAt: Date;
}
export interface StrategyPerformance extends Document, StrategyPerformanceBase {
}
export type StrategyPerformanceDocument = StrategyPerformance;
export interface PerformanceReport {
    strategyId: Types.ObjectId;
    userId: Types.ObjectId;
    period: ReportPeriod;
    startDate: Date;
    endDate: Date;
    metrics: PerformanceMetrics;
    trades: PerformanceTrade[];
    periods: PerformancePeriod[];
    createdAt: Date;
    updatedAt: Date;
}
export interface PerformanceChart {
    strategyId: Types.ObjectId;
    userId: Types.ObjectId;
    period: ReportPeriod;
    startDate: Date;
    endDate: Date;
    equity: {
        date: Date;
        value: number;
    }[];
    drawdown: {
        date: Date;
        value: number;
    }[];
    returns: {
        date: Date;
        value: number;
    }[];
    createdAt: Date;
    updatedAt: Date;
}
export interface PerformanceComparison {
    strategyId: Types.ObjectId;
    userId: Types.ObjectId;
    period: ReportPeriod;
    startDate: Date;
    endDate: Date;
    strategyMetrics: PerformanceMetrics;
    benchmarkMetrics: PerformanceMetrics;
    relativePerformance: {
        return: number;
        risk: number;
        sharpe: number;
        sortino: number;
        information: number;
    };
    createdAt: Date;
    updatedAt: Date;
}
export type PerformanceReportDocument = PerformanceReport;
export type PerformanceChartDocument = PerformanceChart;
export type PerformanceComparisonDocument = PerformanceComparison;
//# sourceMappingURL=Performance.d.ts.map