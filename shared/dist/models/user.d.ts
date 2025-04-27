import mongoose, { Document, Types } from 'mongoose';
export interface IUser extends Document {
    email: string;
    username?: string;
    password: string;
    walletAddress?: string;
    role: 'user' | 'admin';
    status: 'active' | 'suspended' | 'inactive';
    isAdmin: boolean;
    adminType?: string;
    permissions: Record<string, any>;
    balance: number;
    lastLogin?: Date;
    createdAt: Date;
    updatedAt: Date;
    referralCode?: string;
    referredBy?: Types.ObjectId;
    name: string;
    comparePassword: (candidatePassword: string) => Promise<boolean>;
}
export declare const User: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser, {}> & IUser & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=user.d.ts.map