import { IStrategy } from '../types/Strategy';
import { IOrder } from '../types/Trading';
import { Types } from 'mongoose';
export declare class StrategyEngine {
    private strategies;
    private orders;
    constructor();
    executeStrategy(strategy: IStrategy & {
        _id: Types.ObjectId;
    }): Promise<void>;
    stopStrategy(strategy: IStrategy & {
        _id: Types.ObjectId;
    }): Promise<void>;
    createOrder(order: Omit<IOrder, '_id' | 'createdAt' | 'updatedAt'>): IOrder;
}
//# sourceMappingURL=StrategyEngine.d.ts.map