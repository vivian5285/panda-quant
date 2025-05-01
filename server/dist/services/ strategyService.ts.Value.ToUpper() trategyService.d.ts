import { IStrategy } from '../types/strategy';
import { Document } from 'mongoose';
export declare class StrategyService {
    private static instance;
    private constructor();
    static getInstance(): StrategyService;
    getStrategies(): Promise<IStrategy[]>;
    getStrategy(id: string): Promise<IStrategy | null>;
    createStrategy(data: Partial<IStrategy>): Promise<IStrategy>;
    updateStrategy(id: string, data: Partial<IStrategy>): Promise<IStrategy | null>;
    deleteStrategy(id: string): Promise<void>;
    getAllStrategies(): Promise<(IStrategy & Document)[]>;
    getStrategiesByUser(userId: string): Promise<(IStrategy & Document)[]>;
    getActiveStrategies(): Promise<(IStrategy & Document)[]>;
    getPopularStrategies(limit?: number): Promise<(IStrategy & Document)[]>;
}
