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
import type { Document, Types } from 'mongoose';
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
export declare enum TradeStatus {
    OPEN = "OPEN",
    CLOSED = "CLOSED"
}
export interface IOrderBase {
    userId: Types.ObjectId;
    strategyId: Types.ObjectId;
    positionId?: Types.ObjectId;
    exchange: string;
    symbol: string;
    orderId: string;
    clientOrderId: string;
    type: OrderType;
    side: 'BUY' | 'SELL';
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
export type OrderBase = IOrderBase;
export interface IOrder extends Document, IOrderBase {
}
export type Order = IOrder;
export type IOrderDocument = IOrder;
export type OrderDocument = Order;
export interface ITradeBase {
    strategyId: Types.ObjectId;
    orderId: Types.ObjectId;
    symbol: string;
    type: 'LONG' | 'SHORT';
    entryPrice: number;
    exitPrice?: number;
    quantity: number;
    leverage: number;
    status: 'OPEN' | 'CLOSED' | 'CANCELLED';
    pnl?: number;
    pnlPercentage?: number;
    entryTime: Date;
    exitTime?: Date;
    stopLoss?: number;
    takeProfit?: number;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
export interface ITrade extends ITradeBase, Document {
}
export type Trade = ITrade;
export type ITradeDocument = ITrade;
export type TradeDocument = Trade;
export interface IOrderBookBase {
    symbol: string;
    bids: Array<[number, number]>;
    asks: Array<[number, number]>;
    timestamp: Date;
}
export type OrderBookBase = IOrderBookBase;
export interface IOrderBook extends Document, IOrderBookBase {
}
export type OrderBook = IOrderBook;
export type IOrderBookDocument = IOrderBook;
export type OrderBookDocument = OrderBook;
export interface IOrderHistoryBase {
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
export type OrderHistoryBase = IOrderHistoryBase;
export interface IOrderHistory extends Document, IOrderHistoryBase {
}
export type OrderHistory = IOrderHistory;
export type IOrderHistoryDocument = IOrderHistory;
export type OrderHistoryDocument = OrderHistory;
export type IOrderCreateInput = Omit<IOrderBase, 'createdAt' | 'updatedAt'>;
export type OrderCreateInput = IOrderCreateInput;
export type IOrderUpdateInput = Partial<IOrderCreateInput>;
export type OrderUpdateInput = IOrderUpdateInput;
export type ITradeCreateInput = Omit<ITradeBase, 'createdAt' | 'updatedAt'>;
export type TradeCreateInput = ITradeCreateInput;
export type ITradeUpdateInput = Partial<ITradeCreateInput>;
export type TradeUpdateInput = ITradeUpdateInput;
//# sourceMappingURL=Trading.d.ts.map