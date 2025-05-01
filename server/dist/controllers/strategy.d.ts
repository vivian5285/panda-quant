import { Response } from 'express';
import { AuthenticatedRequest } from '../types/auth';
export declare class StrategyController {
    private strategyService;
    constructor();
    getStrategies: (req: AuthenticatedRequest, res: Response) => Promise<void>;
    getStrategy: (req: AuthenticatedRequest, res: Response) => Promise<void>;
    createStrategy: (req: AuthenticatedRequest, res: Response) => Promise<void>;
    updateStrategy: (req: AuthenticatedRequest, res: Response) => Promise<void>;
    deleteStrategy: (req: AuthenticatedRequest, res: Response) => Promise<void>;
}
declare const strategyController: StrategyController;
export default strategyController;
