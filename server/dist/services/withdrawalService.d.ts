import { Types } from 'mongoose';
import { IWithdrawalDocument } from '../models/Withdrawal';
export declare class WithdrawalService {
    createWithdrawal(data: {
        userId: Types.ObjectId;
        amount: number;
        walletAddress: string;
        paymentMethod: 'crypto' | 'bank' | 'paypal';
        paymentDetails: Record<string, any>;
        status?: string;
        metadata?: Record<string, any>;
    }): Promise<IWithdrawalDocument>;
    getWithdrawals(userId: Types.ObjectId): Promise<IWithdrawalDocument[]>;
    getWithdrawalById(id: string): Promise<IWithdrawalDocument | null>;
    updateWithdrawal(id: string, data: Partial<IWithdrawalDocument>): Promise<IWithdrawalDocument | null>;
    deleteWithdrawal(id: string): Promise<boolean>;
}
