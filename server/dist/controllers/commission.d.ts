import { Response } from 'express';
import { AuthRequest } from '../types/auth';
export declare class CommissionController {
    private static instance;
    private commissionService;
    private constructor();
    static getInstance(): CommissionController;
    private checkAuth;
    createCommission(req: AuthRequest, res: Response): Promise<void>;
    getCommissions(req: AuthRequest, res: Response): Promise<void>;
    getCommission(req: AuthRequest, res: Response): Promise<void>;
    updateCommission(req: AuthRequest, res: Response): Promise<void>;
    deleteCommission(req: AuthRequest, res: Response): Promise<void>;
}
