import { IOrder, IOrderCreateInput } from '../types/Trading';
import { OrderStatus } from '../types/Enums';
export declare class OrderService {
    private static instance;
    private constructor();
    static getInstance(): OrderService;
    private convertToIOrder;
    createOrder(orderData: IOrderCreateInput): Promise<IOrder>;
    getOrderById(id: string): Promise<IOrder | null>;
    updateOrderStatus(id: string, status: OrderStatus): Promise<IOrder | null>;
    getOrdersByUser(userId: string): Promise<IOrder[]>;
    getOrdersByStatus(status: OrderStatus): Promise<IOrder[]>;
    getOrdersByStrategyId(strategyId: string): Promise<IOrder[]>;
    getOrdersByUserId(userId: string): Promise<IOrder[]>;
}
//# sourceMappingURL=OrderService.d.ts.map