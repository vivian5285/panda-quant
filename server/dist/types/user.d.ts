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
/// <reference types="@/types/mongoose" />
import { Document, Types } from 'mongoose';
export interface IUserBase {
    email: string;
    password: string;
    name: string;
    username: string;
    role: 'user' | 'admin';
    level: number;
    status: string;
    permissions: string[];
    isAdmin: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export interface IUser extends IUserBase, Document {
    comparePassword(candidatePassword: string): Promise<boolean>;
}
export interface UserResponse {
    id: string;
    email: string;
    name: string;
    role: string;
}
export interface LoginRequest {
    email: string;
    password: string;
}
export interface RegisterRequest {
    email: string;
    password: string;
    name: string;
}
export interface UpdateUserRequest {
    name?: string;
    email?: string;
}
export interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
}
export interface UpdateUserByIdRequest {
    name?: string;
    email?: string;
    level: number;
    role: string;
    status: string;
    permissions: string[];
    isAdmin: boolean;
    referrerId?: Types.ObjectId;
    referrer?: string;
    balance?: number;
    createdAt: Date;
    updatedAt: Date;
}
export interface IUserDocument extends IUserBase, Document {
    comparePassword(candidatePassword: string): Promise<boolean>;
}
export type User = IUser;
