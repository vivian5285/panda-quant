import { Order, OrderStatus } from '../types/order';
export declare class OrderQueueService {
    private static instance;
    private queue;
    private processing;
    private maxRetries;
    private retryDelay;
    private constructor();
    static getInstance(): OrderQueueService;
    addOrder(order: Omit<Order, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Promise<string>;
    processOrder(orderId: string): Promise<void>;
    cancelOrder(orderId: string): Promise<boolean>;
    getOrderStatus(orderId: string): OrderStatus | null;
    private executeOrder;
}
