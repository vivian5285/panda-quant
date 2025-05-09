import mongoose, { Document, Types } from 'mongoose';
export interface IStrategy {
    _id: Types.ObjectId;
    userId: Types.ObjectId;
    name: string;
    description: string;
    type: 'manual' | 'automated';
    status: 'active' | 'inactive' | 'deleted';
    config: {
        tradingPairs: string[];
        timeframe: string;
        riskLevel: 'low' | 'medium' | 'high';
        maxPositions: number;
        maxDrawdown: number;
        stopLoss: number;
        takeProfit: number;
    };
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
export interface IStrategyDocument extends Document {
    _id: Types.ObjectId;
    userId: Types.ObjectId;
    name: string;
    description: string;
    type: 'manual' | 'automated';
    status: 'active' | 'inactive' | 'deleted';
    config: {
        tradingPairs: string[];
        timeframe: string;
        riskLevel: 'low' | 'medium' | 'high';
        maxPositions: number;
        maxDrawdown: number;
        stopLoss: number;
        takeProfit: number;
    };
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
export declare const Strategy: mongoose.Model<IStrategyDocument, {}, {}, {}, mongoose.Document<unknown, {}, IStrategyDocument, {}> & IStrategyDocument & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default Strategy;
//# sourceMappingURL=strategy.model.d.ts.map