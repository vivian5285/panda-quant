import mongoose, { Types } from 'mongoose';
import { IStrategyReview } from '../types/StrategyReview';
export declare const StrategyReview: mongoose.Model<IStrategyReview, {}, {}, {}, mongoose.Document<unknown, {}, IStrategyReview, {}> & IStrategyReview & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default StrategyReview;
//# sourceMappingURL=StrategyReview.d.ts.map