import { IWithdrawal } from '../types/Withdrawal';
export declare class WithdrawalService {
    private static instance;
    private constructor();
    static getInstance(): WithdrawalService;
    private convertToIWithdrawal;
    createWithdrawal(withdrawalData: Partial<IWithdrawal>): Promise<IWithdrawal>;
    getWithdrawalById(id: string): Promise<IWithdrawal | null>;
    getWithdrawalByUserId(userId: string): Promise<IWithdrawal | null>;
    getWithdrawalsByUserId(userId: string): Promise<IWithdrawal[]>;
    updateWithdrawal(id: string, data: Partial<IWithdrawal>): Promise<IWithdrawal | null>;
    deleteWithdrawal(id: string): Promise<boolean>;
}
//# sourceMappingURL=WithdrawalService.d.ts.map