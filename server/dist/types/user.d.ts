/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose/types/inferschematype" />
/// <reference types="mongoose/types/inferrawdoctype" />
import type { Document, Types } from 'mongoose';
import type { UserRole, UserLevel, UserStatus } from './Enums';
export interface UserBase {
    email: string;
    password: string;
    name: string;
    username: string;
    role: UserRole;
    level: UserLevel;
    status: UserStatus;
    permissions: string[];
    isAdmin: boolean;
    createdAt: Date;
    updatedAt: Date;
    balance: number;
    accountBalance: number;
    subscriptionFee: number;
    referrerId?: Types.ObjectId;
    referrer?: string;
}
export interface User extends Document, UserBase {
    _id: Types.ObjectId;
    comparePassword(candidatePassword: string): Promise<boolean>;
}
export type UserDocument = User;
export interface UserResponse {
    _id: string;
    email: string;
    name: string;
    username: string;
    role: UserRole;
    level: UserLevel;
    status: UserStatus;
    isAdmin: boolean;
}
export interface LoginRequest {
    email: string;
    password: string;
}
export interface RegisterRequest {
    email: string;
    password: string;
    name: string;
    username: string;
}
export interface UpdateUserRequest {
    name?: string;
    email?: string;
    username?: string;
}
export interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
}
export interface UpdateUserByIdRequest {
    name?: string;
    email?: string;
    username?: string;
    level?: UserLevel;
    role?: UserRole;
    status?: UserStatus;
    permissions?: string[];
    isAdmin?: boolean;
    referrerId?: Types.ObjectId;
    referrer?: string;
    balance?: number;
    accountBalance?: number;
    subscriptionFee?: number;
    updatedAt?: Date;
}
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
    createdAt: Date;
    updatedAt: Date;
}
export interface IUserDocument extends IUser, Document {
    comparePassword(candidatePassword: string): Promise<boolean>;
}
export type IUserBase = Omit<IUser, 'password'>;
//# sourceMappingURL=User.d.ts.map