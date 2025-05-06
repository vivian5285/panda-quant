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
