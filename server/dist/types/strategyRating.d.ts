/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose/types/inferschematype" />
/// <reference types="@/types/mongoose" />
import { Document, Types } from 'mongoose';
export interface IStrategyRating {
    strategyId: Types.ObjectId;
    userId: Types.ObjectId;
    rating: number;
    comment?: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface IStrategyRatingDocument extends Omit<IStrategyRating, '_id'>, Document {
    _id: Types.ObjectId;
}
export interface IStrategyRatingService {
    getRatingsByStrategyId(strategyId: string): Promise<IStrategyRatingDocument[]>;
    getRatingById(id: string): Promise<IStrategyRatingDocument | null>;
    createRating(rating: IStrategyRating): Promise<IStrategyRatingDocument>;
    updateRating(id: string, rating: Partial<IStrategyRating>): Promise<IStrategyRatingDocument | null>;
    deleteRating(id: string): Promise<boolean>;
    getAverageRating(strategyId: string): Promise<number>;
}
