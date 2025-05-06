import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/Auth';
export declare class SettlementController {
    private settlementService;
    constructor();
    getSettlements: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
    getSettlementById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    createSettlement: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    updateSettlementStatus: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getSettlementSummary: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
    getPendingSettlements: (_req: Request, res: Response, next: NextFunction) => Promise<void>;
    getSettlementsByType: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
    exportSettlements: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
    generateSettlements: (_req: Request, res: Response, next: NextFunction) => Promise<void>;
    processPayment: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
