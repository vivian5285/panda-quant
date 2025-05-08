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
/// <reference types="mongoose/types/inferrawdoctype" />
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