import { Document, Types } from 'mongoose';
export interface IStrategyReview extends Document {
    _id: Types.ObjectId;
    userId: Types.ObjectId;
    strategyId: Types.ObjectId;
    rating: number;
    comment?: string;
    createdAt: Date;
    updatedAt: Date;
}
export type StrategyReview = IStrategyReview;
export interface StrategyReviewCreateInput {
    userId: Types.ObjectId;
    strategyId: Types.ObjectId;
    rating: number;
    comment?: string;
}
export interface StrategyReviewUpdateInput {
    rating?: number;
    comment?: string;
}
//# sourceMappingURL=StrategyReview.d.ts.map