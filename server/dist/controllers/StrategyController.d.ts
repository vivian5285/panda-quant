import { Request, Response } from 'express';
export declare const strategyController: {
    getAllStrategies(_req: Request, res: Response): Promise<void>;
    getStrategyById(req: Request, res: Response): Promise<void>;
    createStrategy(req: Request, res: Response): Promise<void>;
    updateStrategy(req: Request, res: Response): Promise<void>;
    deleteStrategy(req: Request, res: Response): Promise<void>;
};
