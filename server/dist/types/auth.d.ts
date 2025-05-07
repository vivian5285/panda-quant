import type { Request } from 'express-serve-static-core';
import type { IUserDocument } from '../models/User';
import type { UserRole } from './Enums';
import type { AuthenticatedRequest } from './express';
export type { AuthenticatedRequest };
export interface AuthRequest extends Request {
    user?: IUserDocument;
}
export interface IAuthToken {
    token: string;
    expiresIn: number;
}
export interface IAuthConfig {
    jwtSecret: string;
    jwtExpiresIn: string;
    maxLoginAttempts: number;
    lockoutDuration: number;
}
export interface IAuthResponse {
    success: boolean;
    message?: string;
    data?: any;
    error?: string;
}
export interface ILoginCredentials {
    email: string;
    password: string;
}
export interface IRegisterCredentials {
    email: string;
    password: string;
    confirmPassword: string;
}
export interface ITokenPayload {
    userId: string;
    email: string;
    role: UserRole;
    permissions: string[];
    exp: number;
}
export interface IResetPasswordData {
    token: string;
    password: string;
    confirmPassword: string;
}
export interface IChangePasswordData {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}
export interface ITwoFactorAuth {
    enabled: boolean;
    code: string;
    secret?: string;
}
//# sourceMappingURL=Auth.d.ts.map