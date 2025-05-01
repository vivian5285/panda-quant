export interface CommissionRecord {
    id: string;
    userId: string;
    type: 'platform' | 'team' | 'withdrawal';
    amount: number;
    sourceUserId?: string;
    generation?: number;
    strategyId?: string;
    tradeId?: string;
    status: 'pending' | 'completed' | 'failed';
    createdAt: Date;
    completedAt?: Date;
}
export interface Wallet {
    userId: string;
    balance: number;
    frozenAmount: number;
    totalCommission: number;
    totalWithdrawal: number;
}
export declare class CommissionService {
    private static instance;
    private commissionRecords;
    private wallets;
    private readonly PLATFORM_FEE_RATE;
    private readonly FIRST_GEN_RATE;
    private readonly SECOND_GEN_RATE;
    private constructor();
    static getInstance(): CommissionService;
    processTradeProfit(userId: string, strategyId: string, tradeId: string, profit: number): Promise<void>;
    private processTeamCommission;
    requestWithdrawal(userId: string, amount: number): Promise<CommissionRecord>;
    completeWithdrawal(recordId: string): Promise<void>;
    getCommissionRecords(userId?: string, type?: CommissionRecord['type']): CommissionRecord[];
    getWallet(userId: string): Wallet | undefined;
    private addCommissionRecord;
    private updateWallet;
    private generateId;
    private getFirstGenerationUsers;
    private getSecondGenerationUsers;
}
