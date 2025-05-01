import { IOrder } from '../interfaces/IOrder';
import { EventEmitter } from 'events';
export declare class OrderQueueService extends EventEmitter {
    private static instance;
    private orderModel;
    private queue;
    private isProcessing;
    private constructor();
    static getInstance(): OrderQueueService;
    addOrder(order: IOrder): Promise<any>;
    private processQueue;
    processOrder(order: IOrder): Promise<void>;
    getQueue(): IOrder[];
    getNextOrder(): Promise<any>;
    updateOrderStatus(orderId: string, status: string): Promise<any>;
}
