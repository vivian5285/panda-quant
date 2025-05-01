import { ICommissionWithdrawal } from '../interfaces/ICommissionWithdrawal';
import { Document } from 'mongoose';
export declare class WithdrawalService {
    private static instance;
    private model;
    static getInstance(): WithdrawalService;
    private constructor();
    createWithdrawal(data: Partial<ICommissionWithdrawal>): Promise<ICommissionWithdrawal & Document>;
    updateWithdrawal(id: string, data: Partial<ICommissionWithdrawal>): Promise<(ICommissionWithdrawal & Document) | null>;
    getWithdrawal(id: string): Promise<ICommissionWithdrawal | null>;
    getAllWithdrawals(): Promise<(ICommissionWithdrawal & Document)[]>;
    deleteWithdrawal(id: string): Promise<boolean>;
    getWithdrawals(userId: string): Promise<(ICommissionWithdrawal & Document)[]>;
    getWithdrawalsByUser(userId: string): Promise<(ICommissionWithdrawal & Document)[]>;
    getPendingWithdrawals(): Promise<(ICommissionWithdrawal & Document)[]>;
    getCompletedWithdrawals(): Promise<(ICommissionWithdrawal & Document)[]>;
    getWithdrawalStats(userId: string): Promise<any>;
    completeWithdrawal(id: string, transactionHash: string): Promise<(ICommissionWithdrawal & Document) | null>;
    rejectWithdrawal(id: string): Promise<(ICommissionWithdrawal & Document) | null>;
}
