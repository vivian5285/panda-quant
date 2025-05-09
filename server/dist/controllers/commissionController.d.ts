import { Response, Request } from 'express';
import { AuthenticatedRequest } from '../types/Auth';
export declare class CommissionController {
    private commissionService;
    constructor();
    getCommissionById: (req: AuthenticatedRequest, res: Response) => Promise<void>;
    getCommissionByUserId: (req: AuthenticatedRequest, res: Response) => Promise<void>;
    createCommission: (req: Request, res: Response) => Promise<void>;
    updateCommission: (req: AuthenticatedRequest, res: Response) => Promise<void>;
    deleteCommission: (req: AuthenticatedRequest, res: Response) => Promise<void>;
    getCommissionRules: (_req: AuthenticatedRequest, res: Response) => Promise<void>;
    createCommissionRule: (req: AuthenticatedRequest, res: Response) => Promise<void>;
    updateCommissionRule: (req: AuthenticatedRequest, res: Response) => Promise<void>;
    deleteCommissionRule: (req: AuthenticatedRequest, res: Response) => Promise<void>;
    getCommissionsByType: (req: AuthenticatedRequest, res: Response) => Promise<void>;
    getCommissionsByStatusAndTypeAndAmount: (req: AuthenticatedRequest, res: Response) => Promise<void>;
    getCommissionsByStatusAndTypeAndAmountAndCurrency: (req: AuthenticatedRequest, res: Response) => Promise<void>;
    getCommissionsByUserAndStatusAndTypeAndAmountAndCurrency: (req: AuthenticatedRequest, res: Response) => Promise<void>;
    getCommissionsByStatusAndTypeAndAmountAndCurrencyAndDescription: (req: AuthenticatedRequest, res: Response) => Promise<void>;
    getCommissionsByStatus: (req: AuthenticatedRequest, res: Response) => Promise<void>;
    getCommissionsByUserAndStatus: (req: AuthenticatedRequest, res: Response) => Promise<void>;
    getCommissionsByDateRangeAndStatus: (req: AuthenticatedRequest, res: Response) => Promise<void>;
    getCommissionsByUserAndDateRangeAndStatus: (req: AuthenticatedRequest, res: Response) => Promise<void>;
    updateCommissionStatus: (req: Request, res: Response) => Promise<void>;
}
//# sourceMappingURL=CommissionController.d.ts.map