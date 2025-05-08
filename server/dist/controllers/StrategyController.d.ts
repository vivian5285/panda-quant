import { Request, Response } from 'express';
export declare class StrategyController {
    private strategyService;
    constructor();
    createStrategy(req: Request, res: Response): Promise<void>;
    getStrategy(req: Request, res: Response): Promise<void>;
    updateStrategy(req: Request, res: Response): Promise<void>;
    deleteStrategy(req: Request, res: Response): Promise<void>;
    getAllStrategies(req: Request, res: Response): Promise<void>;
    startStrategy(req: Request, res: Response): Promise<void>;
    stopStrategy(req: Request, res: Response): Promise<void>;
    pauseStrategy(req: Request, res: Response): Promise<void>;
    resumeStrategy(req: Request, res: Response): Promise<void>;
    getStrategiesByUser(req: Request, res: Response): Promise<void>;
    getActiveStrategies(req: Request, res: Response): Promise<void>;
    getPopularStrategies(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=StrategyController.d.ts.map