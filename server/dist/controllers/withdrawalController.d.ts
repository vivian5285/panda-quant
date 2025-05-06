import { Response } from 'express';
import { AuthenticatedRequest } from '../types/Auth';
export declare class WithdrawalController {
    createWithdrawal(req: AuthenticatedRequest, res: Response): Promise<void>;
    getWithdrawals(req: AuthenticatedRequest, res: Response): Promise<void>;
    getWithdrawalById(req: AuthenticatedRequest, res: Response): Promise<void>;
    updateWithdrawal(req: AuthenticatedRequest, res: Response): Promise<void>;
    deleteWithdrawal(req: AuthenticatedRequest, res: Response): Promise<void>;
}
