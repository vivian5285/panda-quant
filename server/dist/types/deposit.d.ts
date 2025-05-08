import { Document, Types } from 'mongoose';
export interface IDeposit {
    userId: Types.ObjectId;
    amount: number;
    currency: string;
    status: 'pending' | 'completed' | 'failed';
    transactionId?: string;
    network: string;
    address: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface IDepositDocument extends Omit<IDeposit, '_id'>, Document {
    _id: Types.ObjectId;
}
export interface IDepositStats {
    totalDeposits: number;
    totalAmount: number;
    pendingDeposits: number;
    completedDeposits: number;
    failedDeposits: number;
    monthlyStats: {
        month: string;
        deposits: number;
        amount: number;
    }[];
    methodStats: {
        method: string;
        deposits: number;
        amount: number;
    }[];
    userStats: {
        userId: Types.ObjectId;
        deposits: number;
        amount: number;
    }[];
}
export type Deposit = IDeposit;
export interface DepositCreateInput extends Omit<IDeposit, '_id' | 'createdAt' | 'updatedAt'> {
}
export interface DepositUpdateInput extends Partial<DepositCreateInput> {
}
export interface LargeDepositAlert {
    type: 'large_deposit';
    message: string;
    data: Deposit;
}
//# sourceMappingURL=Deposit.d.ts.map