import { Document, Types } from 'mongoose';
export interface IWithdrawal {
    userId: Types.ObjectId;
    amount: number;
    currency: string;
    status: 'pending' | 'completed' | 'failed';
    network: string;
    address: string;
    transactionId?: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface IWithdrawalDocument extends Omit<IWithdrawal, '_id'>, Document {
    _id: Types.ObjectId;
}
export type Withdrawal = IWithdrawal;
export interface WithdrawalCreateInput extends Omit<IWithdrawal, '_id' | 'createdAt' | 'updatedAt'> {
}
export interface WithdrawalUpdateInput extends Partial<WithdrawalCreateInput> {
}
export interface WithdrawalNotification {
    userId: Types.ObjectId;
    amount: number;
    currency: string;
    network: string;
    address: string;
    transactionId: string;
    status: 'pending' | 'completed' | 'failed';
}
//# sourceMappingURL=Withdrawal.d.ts.map