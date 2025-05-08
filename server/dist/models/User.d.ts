import { Document, Types } from 'mongoose';
import { UserLevel } from '../types/Enums';
export interface IUser {
    username: string;
    email: string;
    password: string;
    name: string;
    role: 'user' | 'admin';
    status: 'active' | 'inactive' | 'suspended';
    level: UserLevel;
    permissions: string[];
    referrerId?: Types.ObjectId;
    referrer?: string;
    isAdmin: boolean;
    balance: number;
    accountBalance: number;
    subscriptionFee: number;
    resetToken?: string;
    resetTokenExpires?: Date;
}
export interface IUserDocument extends Document {
    username: string;
    email: string;
    password: string;
    name: string;
    role: 'user' | 'admin';
    status: 'active' | 'inactive' | 'suspended';
    level: UserLevel;
    permissions: string[];
    referrerId?: Types.ObjectId;
    referrer?: string;
    isAdmin: boolean;
    balance: number;
    accountBalance: number;
    subscriptionFee: number;
    resetToken?: string;
    resetTokenExpires?: Date;
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}
export declare const User: import("mongoose").Model<IUserDocument, {}, {}, {}, Document<unknown, {}, IUserDocument, {}> & IUserDocument & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default User;
//# sourceMappingURL=User.d.ts.map