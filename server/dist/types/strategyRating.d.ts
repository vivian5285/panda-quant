import { Types } from 'mongoose';
export interface IStrategyRating {
    _id: Types.ObjectId;
    strategyId: string;
    userId: string;
    rating: number;
    comment?: string;
    createdAt: Date;
    updatedAt: Date;
}
