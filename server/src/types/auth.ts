import { Request } from 'express';
import type { UserRole } from './Enums';
import { IUserDocument } from './User';
import type { ParamsDictionary } from 'express-serve-static-core';
import type { ParsedQs } from 'qs';

export interface AuthRequest extends Request {
  user?: IUserDocument;
}

export interface AuthToken {
  token: string;
  expiresIn: number;
}

export interface AuthConfig {
  jwtSecret: string;
  jwtExpiresIn: string;
  maxLoginAttempts: number;
  lockoutDuration: number;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  data?: any;
  error?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface TokenPayload {
  userId: string;
  email: string;
  role: UserRole;
  permissions: string[];
  exp: number;
}

export interface ResetPasswordData {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface TwoFactorAuth {
  enabled: boolean;
  code: string;
  secret?: string;
}

export interface IAuthResponse {
  user: IUserDocument;
  token: string;
  refreshToken: string;
}

export interface ILoginCredentials {
  email: string;
  password: string;
}

export interface IRegisterData {
  email: string;
  password: string;
  confirmPassword: string;
  username?: string;
}

export interface ILoginData {
  email: string;
  password: string;
}

export interface IResetPasswordData {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface AuthenticatedRequest extends Request {
  user?: IUserDocument;
}

// export interface AuthenticatedRequest extends Request {
//   user?: IUser;
// } 