import { StrategyParameters, StrategyStatus } from '../types/strategy';
import { Order } from '../types/order';
export declare class StrategyEngine {
    private riskManagementService;
    private monitorService;
    constructor();
    executeStrategy(strategyId: string, parameters: StrategyParameters): Promise<{
        executionId: string;
        status: StrategyStatus;
    }>;
    createOrder(order: Omit<Order, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Promise<Order>;
}
