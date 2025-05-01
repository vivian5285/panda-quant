import { Document, Types } from 'mongoose';
export interface IUser {
    username: string;
    email: string;
    password: string;
    name: string;
    role: 'user' | 'admin';
    status: 'active' | 'inactive' | 'suspended';
    level: number;
    permissions: string[];
    referrerId?: Types.ObjectId;
    referrer?: string;
    isAdmin: boolean;
    balance: number;
}
export interface IUserDocument extends Document {
    username: string;
    email: string;
    password: string;
    name: string;
    role: 'user' | 'admin';
    status: 'active' | 'inactive' | 'suspended';
    level: number;
    permissions: string[];
    referrerId?: Types.ObjectId;
    referrer?: string;
    isAdmin: boolean;
    balance: number;
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
