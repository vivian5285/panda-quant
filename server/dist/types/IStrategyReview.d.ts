import { Document, Types } from 'mongoose';
export interface IStrategyReview {
    strategyId: Types.ObjectId;
    userId: Types.ObjectId;
    rating: number;
    comment: string;
    status: 'pending' | 'approved' | 'rejected';
    createdAt: Date;
    updatedAt: Date;
}
export interface IStrategyReviewDocument extends IStrategyReview, Document {
}
