import { Request } from 'express';
import { IUser } from './user';

export interface IAuthRequest extends Request {
  user?: IUser;
}

export interface ILoginCredentials {
  email: string;
  password: string;
}

export interface IRegisterData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface IAuthResponse {
  token: string;
  user: {
    _id: string;
    username: string;
    email: string;
    role: string;
  };
}

export interface ITokenPayload {
  userId: string;
  role: string;
  iat?: number;
  exp?: number;
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

export interface ITwoFactorData {
  code: string;
  secret?: string;
}

export interface IAuthConfig {
  jwtSecret: string;
  jwtExpiration: string;
  refreshTokenExpiration: string;
  twoFactorEnabled: boolean;
  maxLoginAttempts: number;
  lockoutDuration: number;
} 