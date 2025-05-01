import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../types/express';
export declare class UserLevelController {
    private userLevelService;
    constructor();
    getAllLevels(_req: Request, res: Response): Promise<void>;
    getUserLevel(req: AuthenticatedRequest, res: Response): Promise<void>;
    createLevel(req: Request, res: Response): Promise<void>;
    updateLevel(req: Request, res: Response): Promise<void>;
    deleteLevel(req: Request, res: Response): Promise<void>;
    addExperience(req: AuthenticatedRequest, res: Response): Promise<void>;
    getUserLevelInfo(req: AuthenticatedRequest, res: Response): Promise<void>;
}
