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
import { Types, Document } from 'mongoose';
import { StrategyType, StrategyStatus } from './enums';
import { IPerformanceMetrics } from './performance';
export interface IStrategyPerformanceMetrics {
    totalTrades: number;
    winningTrades: number;
    losingTrades: number;
    winRate: number;
    profitFactor: number;
    averageWin: number;
    averageLoss: number;
    maxDrawdown: number;
    sharpeRatio: number;
    sortinoRatio: number;
    totalProfit: number;
    monthlyReturns: number[];
    dailyReturns: number[];
}
export interface IStrategy {
    userId: Types.ObjectId;
    name: string;
    description?: string;
    type: StrategyType;
    status: StrategyStatus;
    parameters: Record<string, any>;
    performance?: {
        totalTrades: number;
        winRate: number;
        profit: number;
        metrics: Record<string, any>;
    };
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
export interface IStrategyDocument extends IStrategy, Document {
}
export interface IStrategyPerformance {
    strategyId: string;
    userId: string;
    period: {
        start: Date;
        end: Date;
    };
    metrics: {
        totalProfit: number;
        largestLoss: number;
        winRate: number;
        averageWin: number;
        averageLoss: number;
    };
    trades: {
        entryTime: Date;
        exitTime: Date;
        entryPrice: number;
        exitPrice: number;
        size: number;
        profit: number;
        type: 'long' | 'short';
        status: 'win' | 'loss';
    }[];
    createdAt: Date;
    updatedAt: Date;
}
export interface IStrategyPerformanceDocument extends IStrategyPerformance, Document {
}
export interface IStrategyRating {
    strategyId: string;
    userId: string;
    rating: number;
    comment?: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface IStrategyRatingDocument extends IStrategyRating, Document {
}
export interface IStrategyBacktest {
    strategyId: string;
    userId: string;
    period: {
        start: Date;
        end: Date;
    };
    settings: {
        initialBalance: number;
        riskPerTrade: number;
        maxDrawdown: number;
        maxDailyLoss: number;
        maxPositionSize: number;
        leverage: number;
        stopLoss: number;
        takeProfit: number;
        timeframes: string[];
        pairs: string[];
    };
    results: IPerformanceMetrics & {
        finalBalance: number;
        return: number;
        annualizedReturn: number;
        volatility: number;
    };
    trades: {
        entryTime: Date;
        exitTime: Date;
        entryPrice: number;
        exitPrice: number;
        size: number;
        profit: number;
        type: 'long' | 'short';
        status: 'win' | 'loss';
    }[];
    createdAt: Date;
    updatedAt: Date;
}
export interface IStrategyBacktestDocument extends IStrategyBacktest, Document {
}
export type Strategy = IStrategy;
export interface StrategyCreateInput extends Omit<IStrategy, 'createdAt' | 'updatedAt'> {
}
export interface StrategyUpdateInput extends Partial<StrategyCreateInput> {
}
export { StrategyType, StrategyStatus };
