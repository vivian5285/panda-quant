import { Types } from 'mongoose';
import { WithdrawalStatus } from '../types/enums';
import { IWithdrawal, IWithdrawalDocument } from '../types/withdrawal';
export declare class WithdrawalService {
    private withdrawalModel;
    constructor();
    createWithdrawal(data: Partial<IWithdrawal>): Promise<IWithdrawalDocument>;
    getWithdrawals(userId: string): Promise<IWithdrawalDocument[]>;
    getWithdrawal(id: string, userId: string): Promise<IWithdrawalDocument | null>;
    updateWithdrawal(id: string, userId: string, data: Partial<IWithdrawal>): Promise<IWithdrawalDocument | null>;
    deleteWithdrawal(id: string, userId: string): Promise<IWithdrawalDocument | null>;
    getWithdrawalsByStatus(userId: string, status: WithdrawalStatus): Promise<IWithdrawalDocument[]>;
    getWithdrawalsByPaymentMethod(userId: string, paymentMethod: string): Promise<IWithdrawalDocument[]>;
    getWithdrawalStats(userId: string): Promise<{
        totalWithdrawals: number;
        totalAmount: number;
        pendingWithdrawals: number;
    }>;
    cancelWithdrawal(data: {
        _id: Types.ObjectId;
        status: string;
    }): Promise<IWithdrawalDocument | null>;
}
