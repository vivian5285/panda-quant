import { Response } from 'express';
import { AuthenticatedRequest } from '../types/express';
export declare class StrategyRatingController {
    private strategyRatingService;
    constructor();
    createRating(req: AuthenticatedRequest, res: Response): Promise<void>;
    getRatings(req: AuthenticatedRequest, res: Response): Promise<void>;
    updateRating(req: AuthenticatedRequest, res: Response): Promise<void>;
    deleteRating(req: AuthenticatedRequest, res: Response): Promise<void>;
}
//# sourceMappingURL=StrategyRatingController.d.ts.map