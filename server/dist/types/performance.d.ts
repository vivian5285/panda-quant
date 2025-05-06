/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose/types/inferschematype" />
/// <reference types="@/types/mongoose" />
import { Document, Types } from 'mongoose';
export interface IPerformanceMetrics {
    totalTrades: number;
    winningTrades: number;
    losingTrades: number;
    winRate: number;
    profitFactor: number;
    averageTradeDuration: number;
    totalProfit: number;
    totalLoss: number;
    maxDrawdown: number;
    sharpeRatio: number;
    sortinoRatio: number;
    averageWin: number;
    averageLoss: number;
    largestWin: number;
    largestLoss: number;
    consecutiveWins: number;
    consecutiveLosses: number;
    monthlyReturns: number[];
    dailyReturns: number[];
}
export interface IPerformanceTrade {
    entryTime: Date;
    exitTime: Date;
    entryPrice: number;
    exitPrice: number;
    size: number;
    profit: number;
    type: 'long' | 'short';
    status: 'win' | 'loss';
}
export interface IPerformancePeriod {
    start: Date;
    end: Date;
}
export interface IStrategyPerformance extends Document {
    _id: Types.ObjectId;
    strategyId: Types.ObjectId;
    userId: string;
    period: IPerformancePeriod;
    metrics: IPerformanceMetrics;
    trades: IPerformanceTrade[];
    createdAt: Date;
    updatedAt: Date;
}
export interface IStrategyPerformanceMetrics {
    totalProfit: number;
    totalLoss: number;
    winRate: number;
    averageProfit: number;
    averageLoss: number;
}
export interface PerformanceMetrics {
    userId: string;
    totalProfit: number;
    monthlyReturn: number;
    annualReturn: number;
    maxDrawdown: number;
    sharpeRatio: number;
    sortinoRatio: number;
    winRate: number;
    profitFactor: number;
    averageTrade: number;
    totalTrades: number;
    startDate: Date;
    endDate: Date;
}
export interface PerformanceReport {
    userId: string;
    period: 'daily' | 'weekly' | 'monthly' | 'yearly';
    startDate: Date;
    endDate: Date;
    metrics: PerformanceMetrics;
    trades: PerformanceTrade[];
    deposits: number;
    withdrawals: number;
    netDeposits: number;
    roi: number;
}
export interface PerformanceTrade {
    id: string;
    userId: string;
    strategyId: string;
    symbol: string;
    type: 'spot' | 'futures' | 'mt4';
    side: 'buy' | 'sell';
    entryPrice: number;
    exitPrice: number;
    amount: number;
    profit: number;
    fee: number;
    entryTime: Date;
    exitTime: Date;
    duration: number;
}
export interface PerformanceChart {
    userId: string;
    period: 'daily' | 'weekly' | 'monthly' | 'yearly';
    data: {
        date: Date;
        equity: number;
        balance: number;
        profit: number;
        drawdown: number;
    }[];
}
export interface PerformanceComparison {
    userId: string;
    period: 'daily' | 'weekly' | 'monthly' | 'yearly';
    startDate: Date;
    endDate: Date;
    strategies: {
        strategyId: string;
        name: string;
        metrics: PerformanceMetrics;
    }[];
}
