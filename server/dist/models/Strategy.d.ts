import { Document, Types } from 'mongoose';
import { StrategyStatus, StrategyType } from '../types/Enums';
export interface IStrategy {
    userId: Types.ObjectId;
    name: string;
    description: string;
    type: StrategyType;
    status: StrategyStatus;
    parameters: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
export interface IStrategyDocument extends IStrategy, Document {
}
export declare const Strategy: import("mongoose").Model<IStrategyDocument, {}, {}, {}, Document<unknown, {}, IStrategyDocument, {}> & IStrategyDocument & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default Strategy;
//# sourceMappingURL=Strategy.d.ts.map