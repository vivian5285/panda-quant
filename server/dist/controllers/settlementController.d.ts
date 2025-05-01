import { Response } from 'express';
import { AuthenticatedRequest } from '../types/auth';
export declare class SettlementController {
    private settlementService;
    constructor();
    getSettlements: (req: AuthenticatedRequest, res: Response) => Promise<void>;
    getSettlementDetails: (req: AuthenticatedRequest, res: Response) => Promise<void>;
    createSettlement: (req: AuthenticatedRequest, res: Response) => Promise<void>;
    updateSettlementStatus: (req: AuthenticatedRequest, res: Response) => Promise<void>;
    getSettlementSummary: (req: AuthenticatedRequest, res: Response) => Promise<void>;
    exportSettlements: (req: AuthenticatedRequest, res: Response) => Promise<void>;
    generateSettlements: (req: AuthenticatedRequest, res: Response) => Promise<void>;
    processPayment: (req: AuthenticatedRequest, res: Response) => Promise<void>;
    updateSettlement: (req: AuthenticatedRequest, res: Response) => Promise<void>;
}
