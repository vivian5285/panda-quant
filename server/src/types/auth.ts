import { Request } from 'express';
import type { UserRole } from './Enums';
import { IUser } from './User';
import type { ParamsDictionary } from 'express-serve-static-core';
import type { ParsedQs } from 'qs';

export interface AuthRequest extends Request {
  user?: IUser;
}

export interface IAuthToken {
  token: string;
  expiresIn: number;
  type: 'access' | 'refresh';
}

export interface IAuthPayload {
  userId: string;
  email: string;
  role: string;
  permissions: string[];
}

export interface IAuthConfig {
  accessTokenSecret: string;
  refreshTokenSecret: string;
  accessTokenExpiresIn: number;
  refreshTokenExpiresIn: number;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    username: string;
    name: string;
    role: string;
    status: string;
    level: string;
    isAdmin: boolean;
  };
}

export interface IAuthService {
  generateTokens(payload: IAuthPayload): Promise<IAuthToken>;
  verifyToken(token: string, type: 'access' | 'refresh'): Promise<IAuthPayload>;
  refreshToken(refreshToken: string): Promise<IAuthToken>;
  revokeToken(token: string): Promise<void>;
}

export interface ILoginRequest {
  email: string;
  password: string;
}

export interface IRegisterRequest {
  email: string;
  password: string;
  username: string;
  name: string;
}

export interface IAuthResponse {
  success: boolean;
  message: string;
  token?: string;
  refreshToken?: string;
  user?: IUser;
  error?: string;
}

export interface ILoginData {
  email: string;
  password: string;
}

export interface IRegisterData {
  email: string;
  password: string;
  name: string;
  username: string;
}

export interface ILoginCredentials {
  email: string;
  password: string;
}

export interface IAuthMiddleware {
  authenticate: (req: any, res: any, next: any) => Promise<void>;
  authorize: (roles: string[]) => (req: any, res: any, next: any) => Promise<void>;
  validateToken: (token: string) => Promise<IAuthPayload>;
}

export interface AuthenticatedRequest extends Request {
  user?: IUser;
}

export interface ResetPasswordRequest {
  email: string;
  token: string;
  newPassword: string;
}

export interface ResetPasswordData {
  email: string;
  token: string;
  newPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface UpdateProfileRequest {
  name?: string;
  email?: string;
  username?: string;
}

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

export interface AuthResult {
  token: string;
  user: {
    _id: string;
    email: string;
    name: string;
    username: string;
    role: string;
    isAdmin: boolean;
  };
}

// export interface AuthenticatedRequest extends Request {
//   user?: IUser;
// } 