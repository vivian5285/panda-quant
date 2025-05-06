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
import { Document } from 'mongoose';
import { IOrder, OrderType, OrderStatus } from '../types/Trading';
export declare const Order: import("mongoose").Model<IOrder, {}, {}, {}, Document<unknown, {}, IOrder> & Document<any, any, any> & {
    _id: string;
    userId: string;
    strategyId: string;
    positionId?: string | undefined;
    exchange: string;
    symbol: string;
    orderId: string;
    clientOrderId: string;
    type: OrderType;
    side: "buy" | "sell";
    amount: number;
    price?: number | undefined;
    stopPrice?: number | undefined;
    status: OrderStatus;
    filledAmount: number;
    averageFillPrice?: number | undefined;
    fee: number;
    feeCurrency: string;
    createdAt: Date;
    updatedAt: Date;
    closedAt?: Date | undefined;
    error?: string | undefined;
    metadata?: Record<string, any> | undefined;
} & {
    _id: import("mongoose").Types.ObjectId;
}, any>;
