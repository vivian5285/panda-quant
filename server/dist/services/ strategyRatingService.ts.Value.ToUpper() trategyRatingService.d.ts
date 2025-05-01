import { IStrategyRating } from '../types/strategyRating';
export declare class StrategyRatingService {
    private static instance;
    private constructor();
    static getInstance(): StrategyRatingService;
    createRating(data: Partial<IStrategyRating>): Promise<import("mongoose").Document<unknown, {}, import("../models/StrategyRating").IStrategyRatingDocument, {}> & import("../models/StrategyRating").IStrategyRatingDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    getRatings(strategyId: string): Promise<(import("mongoose").Document<unknown, {}, import("../models/StrategyRating").IStrategyRatingDocument, {}> & import("../models/StrategyRating").IStrategyRatingDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    getUserRatings(userId: string): Promise<IStrategyRating[]>;
    getAverageRating(strategyId: string): Promise<{
        average: number;
        count: number;
    }>;
    updateRating(id: string, data: {
        rating?: number;
        comment?: string;
        userId: string;
    }): Promise<IStrategyRating>;
    deleteRating(id: string, userId: string): Promise<void>;
    getRating(id: string): Promise<IStrategyRating | null>;
}
