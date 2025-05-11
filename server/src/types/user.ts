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
  _id: Types.ObjectId;
  username: string;
  email: string;
  password: string;
  name: string;
  role: UserRole;
  status: UserStatus;
  level: UserLevel;
  isAdmin: boolean;
  permissions: string[];
  resetToken?: string;
  balance: {
    available: number;
    locked: number;
    currency: string;
  };
  settings: {
    twoFactorEnabled: boolean;
    notificationPreferences: {
      email: boolean;
      telegram: boolean;
      push: boolean;
    };
    tradingPreferences: {
      defaultLeverage: number;
      defaultMarginType: string;
      defaultTimeInForce: string;
    };
  };
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserDocument extends Document, Omit<IUser, '_id'> {
  _id: Types.ObjectId;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export type IUserBase = Omit<IUser, 'password'>; 