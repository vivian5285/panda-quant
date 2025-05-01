import { Response } from 'express';
import { AuthenticatedRequest } from '../types/auth';
export declare class WithdrawalController {
    private withdrawalService;
    constructor();
    createWithdrawal: (req: AuthenticatedRequest, res: Response) => Promise<void>;
    getWithdrawals: (req: AuthenticatedRequest, res: Response) => Promise<void>;
    getWithdrawal: (req: AuthenticatedRequest, res: Response) => Promise<void>;
    updateWithdrawal: (req: AuthenticatedRequest, res: Response) => Promise<void>;
    deleteWithdrawal: (req: AuthenticatedRequest, res: Response) => Promise<void>;
}
declare const _default: WithdrawalController;
export default _default;
