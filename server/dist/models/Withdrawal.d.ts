import { Document, Types } from 'mongoose';
export interface IWithdrawalDocument extends Document {
    userId: Types.ObjectId;
    amount: number;
    status: string;
    walletAddress: string;
    paymentMethod: 'crypto' | 'bank' | 'paypal';
    paymentDetails: Record<string, any>;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
export declare const Withdrawal: import("mongoose").Model<IWithdrawalDocument, {}, {}, {}, Document<unknown, {}, IWithdrawalDocument, {}> & IWithdrawalDocument & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default Withdrawal;
