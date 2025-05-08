import { Document, Types } from 'mongoose';
import { IStrategyRating } from '../types/StrategyRating';
export interface IStrategyRatingDocument extends IStrategyRating, Document {
    _id: Types.ObjectId;
}
export declare const StrategyRating: import("mongoose").Model<IStrategyRatingDocument, {}, {}, {}, Document<unknown, {}, IStrategyRatingDocument, {}> & IStrategyRatingDocument & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=StrategyRating.d.ts.map