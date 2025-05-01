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
import { IOrder } from '../types/IOrder';
import { OrderStatus } from '../types';
import { Document } from 'mongoose';
export declare class OrderService {
    private static instance;
    private constructor();
    static getInstance(): OrderService;
    createOrder(orderData: Partial<IOrder>): Promise<IOrder & Document>;
    getOrderById(id: string): Promise<(IOrder & Document) | null>;
    updateOrderStatus(id: string, status: OrderStatus): Promise<(IOrder & Document) | null>;
    getOrdersByUser(userId: string): Promise<(IOrder & Document)[]>;
    getOrdersByStatus(status: OrderStatus): Promise<(IOrder & Document)[]>;
}
