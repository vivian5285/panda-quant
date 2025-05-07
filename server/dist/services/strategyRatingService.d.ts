import { IStrategyRating } from '../types/StrategyRating';
export declare class StrategyRatingService {
    createRating(data: {
        userId: string;
        strategyId: string;
        rating: number;
        comment?: string;
    }): Promise<IStrategyRating>;
    getStrategyRatings(strategyId: string): Promise<IStrategyRating[]>;
    getUserRatings(userId: string): Promise<IStrategyRating[]>;
    getAverageRating(strategyId: string): Promise<{
        average: number;
        count: number;
    }>;
    updateRating(id: string, userId: string, data: {
        rating?: number;
        comment?: string;
    }): Promise<IStrategyRating | null>;
    deleteRating(id: string, userId: string): Promise<boolean>;
    getRatings(strategyId?: string): Promise<IStrategyRating[]>;
}
//# sourceMappingURL=StrategyRatingService.d.ts.map