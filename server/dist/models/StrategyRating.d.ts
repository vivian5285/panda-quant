import { Document, Types } from 'mongoose';
import { IStrategyRating } from '../types/strategyRating';
export interface IStrategyRatingDocument extends IStrategyRating, Document {
    _id: Types.ObjectId;
}
export declare const StrategyRating: import("mongoose").Model<IStrategyRatingDocument, {}, {}, {}, Document<unknown, {}, IStrategyRatingDocument, {}> & IStrategyRatingDocument & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
