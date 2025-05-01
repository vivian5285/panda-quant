import { IStrategy } from '../types/strategy';
import { IOrder } from '../types/IOrder';
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
