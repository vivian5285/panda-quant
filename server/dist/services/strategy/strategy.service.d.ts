import { Types } from 'mongoose';
import { IStrategy } from '../../types/strategy';
export declare class StrategyService {
    private static instance;
    private strategyModel;
    private constructor();
    static getInstance(): StrategyService;
    createStrategy(strategyData: Partial<IStrategy>): Promise<IStrategy>;
    getStrategyById(id: Types.ObjectId): Promise<IStrategy | null>;
    updateStrategy(id: Types.ObjectId, updates: Partial<IStrategy>): Promise<IStrategy | null>;
    deleteStrategy(id: Types.ObjectId): Promise<boolean>;
    getStrategiesByUserId(userId: Types.ObjectId): Promise<IStrategy[]>;
}
