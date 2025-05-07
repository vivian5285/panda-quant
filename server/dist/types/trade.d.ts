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
import { Document, Types } from 'mongoose';
export interface ITrade {
    userId: Types.ObjectId;
    strategyId: Types.ObjectId;
    symbol: string;
    type: 'long' | 'short';
    side: 'buy' | 'sell';
    quantity: number;
    price: number;
    status: 'pending' | 'executed' | 'cancelled' | 'failed';
    executedAt?: Date;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
export interface ITradeDocument extends Omit<ITrade, '_id'>, Document {
    _id: Types.ObjectId;
}
export type Trade = ITrade;
export interface TradeCreateInput extends Omit<ITrade, '_id' | 'createdAt' | 'updatedAt'> {
}
export interface TradeUpdateInput extends Partial<TradeCreateInput> {
}
//# sourceMappingURL=Trade.d.ts.map