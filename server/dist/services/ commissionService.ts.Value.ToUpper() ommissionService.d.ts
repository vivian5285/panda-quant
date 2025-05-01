import { Document } from 'mongoose';
import { ICommission, ICommissionPerformance } from '../types/commission';
interface GetUserCommissionsOptions {
    page?: number;
    limit?: number;
    startDate?: Date;
    endDate?: Date;
    status?: string;
}
export declare class CommissionService {
    private static instance;
    private commissionModel;
    private userModel;
    private constructor();
    static getInstance(): CommissionService;
    createCommission(data: Partial<ICommission>): Promise<ICommission & Document>;
    getCommissionById(id: string): Promise<(ICommission & Document) | null>;
    updateCommission(id: string, updateData: Partial<ICommission>): Promise<(ICommission & Document) | null>;
    deleteCommission(id: string): Promise<boolean>;
    getUserCommissions(userId: string, options?: GetUserCommissionsOptions): Promise<{
        commissions: ICommission[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getTeamInfo(userId: string): Promise<any>;
    getCommissionTrendByType(userId: string, type: 'referral' | 'team' | 'bonus', days: number): Promise<Array<{
        date: Date;
        amount: number;
    }>>;
    getUserCommissionStats(userId: string): Promise<{
        totalCommission: number;
        pendingCommission: number;
        paidCommission: number;
        cancelledCommission: number;
    }>;
    calculateAndDistributeCommission(performance: ICommissionPerformance): Promise<ICommission>;
}
export {};
