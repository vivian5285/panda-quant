import { Types } from 'mongoose';
import { IStrategy } from '../types/strategy';
export declare class StrategyService {
    private static instance;
    private constructor();
    static getInstance(): StrategyService;
    createStrategy(data: Partial<IStrategy>): Promise<import("mongoose").Document<unknown, {}, import("../models/Strategy").IStrategyDocument, {}> & import("../models/Strategy").IStrategyDocument & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    getStrategies(userId: string): Promise<(import("mongoose").Document<unknown, {}, import("../models/Strategy").IStrategyDocument, {}> & import("../models/Strategy").IStrategyDocument & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    updateStrategy(id: string, data: Partial<IStrategy>): Promise<(import("mongoose").Document<unknown, {}, import("../models/Strategy").IStrategyDocument, {}> & import("../models/Strategy").IStrategyDocument & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
}
