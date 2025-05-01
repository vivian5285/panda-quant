import { Types } from 'mongoose';
import { ICommission } from '../types/commission';
import { Document } from 'mongoose';
export declare class CommissionService {
    private static instance;
    private commissionModel;
    private userModel;
    private constructor();
    static getInstance(): CommissionService;
    createCommission(data: Omit<ICommission, 'id'>): Promise<ICommission & Document>;
    getCommissionById(id: string): Promise<(ICommission & Document) | null>;
    updateCommission(id: string, data: Partial<ICommission>): Promise<(ICommission & Document) | null>;
    deleteCommission(id: string): Promise<boolean>;
    getCommissionsByUserId(userId: string): Promise<(ICommission & Document)[]>;
    getCommissionStats(userId: string): Promise<{
        totalMembers: number;
        totalCommission: number;
        pendingCommission: number;
    }>;
    getAllUserCommissions(page: number, limit: number): Promise<{
        commissions: (ICommission & Document)[];
        total: number;
    }>;
    calculateCommission(userId: string, amount: number): Promise<number>;
    getTeamInfo(userId: string): Promise<{
        members: any[];
        stats: {
            totalMembers: number;
            directMembers: number;
            totalCommission: number;
            pendingCommission: number;
        };
    }>;
    getCommissionRecords(userId: string, page: number, limit: number, status?: string): Promise<{
        records: (ICommission & Document)[];
        total: number;
    }>;
    getCommissionTrend(userId: Types.ObjectId, startDate?: string, endDate?: string): Promise<any[]>;
    private getTeamMembers;
    private getTeamStats;
    private getUserCommissionRecords;
    private getUserCommissionRecordsCount;
    private getUsersWithCommission;
    private getUsersWithCommissionCount;
}
