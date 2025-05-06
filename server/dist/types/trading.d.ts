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
export declare enum OrderType {
    MARKET = "market",
    LIMIT = "limit",
    STOP = "stop",
    STOP_LIMIT = "stop_limit"
}
export declare enum OrderStatus {
    PENDING = "pending",
    OPEN = "open",
    CLOSED = "closed",
    CANCELLED = "cancelled",
    FAILED = "failed"
}
export declare enum TradeType {
    SPOT = "spot",
    FUTURES = "futures",
    MT4 = "mt4"
}
export declare enum TradeStatus {
    OPEN = "open",
    CLOSED = "closed",
    CANCELLED = "cancelled"
}
export interface IOrder extends Document {
    _id: string;
    userId: string;
    strategyId: string;
    positionId?: string;
    exchange: string;
    symbol: string;
    orderId: string;
    clientOrderId: string;
    type: OrderType;
    side: 'buy' | 'sell';
    amount: number;
    price?: number;
    stopPrice?: number;
    status: OrderStatus;
    filledAmount: number;
    averageFillPrice?: number;
    fee: number;
    feeCurrency: string;
    createdAt: Date;
    updatedAt: Date;
    closedAt?: Date;
    error?: string;
    metadata?: Record<string, any>;
}
export interface ITrade extends Document {
    _id: Types.ObjectId;
    userId: Types.ObjectId;
    strategyId: Types.ObjectId;
    orderId: Types.ObjectId;
    symbol: string;
    type: TradeType;
    side: 'buy' | 'sell';
    amount: number;
    price: number;
    status: TradeStatus;
    fee: number;
    feeCurrency: string;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
export interface IOrderBook extends Document {
    _id: Types.ObjectId;
    symbol: string;
    bids: {
        price: number;
        quantity: number;
    }[];
    asks: {
        price: number;
        quantity: number;
    }[];
    timestamp: Date;
    createdAt: Date;
    updatedAt: Date;
}
export interface IOrderHistory extends Document {
    _id: Types.ObjectId;
    userId: Types.ObjectId;
    strategyId: Types.ObjectId;
    orders: {
        orderId: Types.ObjectId;
        symbol: string;
        type: string;
        side: string;
        status: string;
        quantity: number;
        price?: number;
        filledQuantity?: number;
        averageFillPrice?: number;
        commission?: number;
        createdAt: Date;
        filledAt?: Date;
        canceledAt?: Date;
    }[];
    period: {
        start: Date;
        end: Date;
    };
    summary: {
        totalOrders: number;
        filledOrders: number;
        canceledOrders: number;
        totalVolume: number;
        totalCommission: number;
        averageFillPrice: number;
        winRate: number;
    };
    createdAt: Date;
    updatedAt: Date;
}
export type Order = IOrder;
export type Trade = ITrade;
export interface OrderCreateInput extends Omit<IOrder, '_id' | 'createdAt' | 'updatedAt'> {
}
export interface OrderUpdateInput extends Partial<OrderCreateInput> {
}
export interface TradeCreateInput extends Omit<ITrade, '_id' | 'createdAt' | 'updatedAt'> {
}
export interface TradeUpdateInput extends Partial<TradeCreateInput> {
}
