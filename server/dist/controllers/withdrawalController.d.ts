import { Response } from 'express';
import { AuthenticatedRequest } from '../types/express';
export declare class WithdrawalController {
    private withdrawalService;
    constructor();
    createWithdrawal(req: AuthenticatedRequest, res: Response): Promise<void>;
    getWithdrawals(req: AuthenticatedRequest, res: Response): Promise<void>;
    getWithdrawalById(req: AuthenticatedRequest, res: Response): Promise<void>;
    updateWithdrawal(req: AuthenticatedRequest, res: Response): Promise<void>;
    deleteWithdrawal(req: AuthenticatedRequest, res: Response): Promise<void>;
}
//# sourceMappingURL=WithdrawalController.d.ts.map