import { IWithdrawal } from '../types/Withdrawal';
export declare class WithdrawalService {
    private static instance;
    private constructor();
    static getInstance(): WithdrawalService;
    createWithdrawal(data: Omit<IWithdrawal, '_id' | 'createdAt' | 'updatedAt'>): Promise<IWithdrawal>;
    getWithdrawalById(id: string): Promise<IWithdrawal | null>;
    updateWithdrawal(id: string, data: Partial<IWithdrawal>): Promise<IWithdrawal | null>;
    deleteWithdrawal(id: string): Promise<boolean>;
    getWithdrawalsByUserId(userId: string): Promise<IWithdrawal[]>;
}
