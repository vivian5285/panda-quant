export interface StrategyRating {
    _id: string;
    strategyId: string;
    userId: string;
    rating: number;
    comment?: string;
    createdAt: Date;
    updatedAt: Date;
} 