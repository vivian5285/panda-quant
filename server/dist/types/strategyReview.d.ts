import { Document, Types } from 'mongoose';
export interface IStrategyReview {
    _id: Types.ObjectId;
    strategyId: Types.ObjectId;
    userId: Types.ObjectId;
    rating: number;
    comment: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface IStrategyReviewDocument extends IStrategyReview, Document {
    _id: Types.ObjectId;
}
