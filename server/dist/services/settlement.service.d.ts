import { SettlementStatus, ISettlementDocument } from '../types/Settlement';
export declare class SettlementService {
    private static instance;
    private constructor();
    static getInstance(): SettlementService;
    createSettlement(userId: string, amount: number, type: string, metadata: Record<string, any>): Promise<ISettlementDocument>;
    updateSettlementStatus(id: string, status: SettlementStatus): Promise<ISettlementDocument | null>;
    getSettlementById(id: string): Promise<ISettlementDocument | null>;
}
//# sourceMappingURL=settlement.service.d.ts.map