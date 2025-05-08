import { IOrder } from '../types/Trading';
import { OrderStatus } from '../types/Enums';
export declare class OrderService {
    private static instance;
    private constructor();
    static getInstance(): OrderService;
    createOrder(orderData: Partial<IOrder>): Promise<IOrder>;
    getOrderById(id: string): Promise<IOrder | null>;
    updateOrderStatus(id: string, status: OrderStatus): Promise<IOrder | null>;
    getOrdersByUser(userId: string): Promise<IOrder[]>;
    getOrdersByStatus(status: OrderStatus): Promise<IOrder[]>;
}
//# sourceMappingURL=OrderService.d.ts.map