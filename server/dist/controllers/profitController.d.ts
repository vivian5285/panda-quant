import { Response } from 'express';
import { AuthenticatedRequest } from '../types/Auth';
export declare class ProfitController {
    private commissionService;
    private profitService;
    constructor();
    getProfitSummary: (_req: AuthenticatedRequest, res: Response) => Promise<void>;
    updateCommission: (req: AuthenticatedRequest, res: Response) => Promise<void>;
    deleteCommission: (req: AuthenticatedRequest, res: Response) => Promise<void>;
}
declare const _default: ProfitController;
export default _default;
