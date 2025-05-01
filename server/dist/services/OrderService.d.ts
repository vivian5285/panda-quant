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
