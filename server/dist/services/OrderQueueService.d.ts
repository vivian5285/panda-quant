import { IOrder } from '../types/trading';
export declare class OrderQueueService {
    private queue;
    addOrder(order: IOrder): Promise<void>;
    getNextOrder(): Promise<IOrder | null>;
    getQueueLength(): Promise<number>;
    clearQueue(): Promise<void>;
    getQueue(): Promise<IOrder[]>;
}
