import { IOrder } from '../types/Trading';
export declare class OrderQueueService {
    private queue;
    addOrder(order: IOrder): Promise<void>;
    getNextOrder(): Promise<IOrder | null>;
    getQueueLength(): Promise<number>;
    clearQueue(): Promise<void>;
    getQueue(): Promise<IOrder[]>;
}
//# sourceMappingURL=OrderQueueService.d.ts.map