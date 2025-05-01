import { Document } from 'mongoose';
import { IStrategy } from '../types/strategy';
export declare enum StrategyStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    PAUSED = "paused",
    COMPLETED = "completed"
}
export interface IStrategyDocument extends IStrategy, Document {
    createdAt: Date;
    updatedAt: Date;
}
export declare const Strategy: import("mongoose").Model<IStrategyDocument, {}, {}, {}, Document<unknown, {}, IStrategyDocument, {}> & IStrategyDocument & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default Strategy;
