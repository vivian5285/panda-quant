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
import { Document } from 'mongoose';
export interface IPosition extends Document {
    _id: string;
    userId: string;
    symbol: string;
    quantity: number;
    entryPrice: number;
    currentPrice: number;
    unrealizedPnL: number;
    realizedPnL: number;
    status: 'open' | 'closed';
    createdAt: Date;
    updatedAt: Date;
}
export interface IPositionHistory extends Document {
    _id: string;
    userId: string;
    strategyId: string;
    positions: {
        positionId: string;
        symbol: string;
        side: string;
        status: string;
        quantity: number;
        entryPrice: number;
        exitPrice?: number;
        unrealizedPnl?: number;
        realizedPnl?: number;
        leverage: number;
        margin: number;
        stopLoss?: number;
        takeProfit?: number;
        createdAt: Date;
        closedAt?: Date;
    }[];
    period: {
        start: Date;
        end: Date;
    };
    summary: {
        totalPositions: number;
        openPositions: number;
        closedPositions: number;
        totalVolume: number;
        totalPnl: number;
        winRate: number;
        averageHoldingTime: number;
        maxDrawdown: number;
        profitFactor: number;
    };
    createdAt: Date;
    updatedAt: Date;
}
export interface IPositionStats {
    totalPositions: number;
    openPositions: number;
    closedPositions: number;
    totalVolume: number;
    totalPnl: number;
    winRate: number;
    averageHoldingTime: number;
    maxDrawdown: number;
    profitFactor: number;
    monthlyStats: {
        month: string;
        positions: number;
        volume: number;
        pnl: number;
    }[];
    symbolStats: {
        symbol: string;
        positions: number;
        volume: number;
        pnl: number;
    }[];
    strategyStats: {
        strategyId: string;
        positions: number;
        volume: number;
        pnl: number;
    }[];
}
export type Position = IPosition;
export interface PositionCreateInput extends Omit<IPosition, '_id' | 'createdAt' | 'updatedAt'> {
}
export interface PositionUpdateInput extends Partial<PositionCreateInput> {
}
//# sourceMappingURL=Position.d.ts.map