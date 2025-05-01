export declare class RiskManagementService {
    private static instance;
    private riskLimits;
    constructor();
    static getInstance(): RiskManagementService;
    private initializeRiskLimits;
    checkStrategyRisk(strategyId: string, params: any): boolean;
    updateRiskLimits(limits: Map<string, number>): void;
    getRiskLimits(): Map<string, number>;
    checkRisk(userId: string, amount: number): Promise<boolean>;
}
