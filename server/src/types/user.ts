import { Document, Types } from 'mongoose';
import { UserRole, UserStatus, UserLevel } from './Enums';

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
  balance?: {
    available?: number;
    locked?: number;
    currency?: string;
  };
  settings?: {
    twoFactorEnabled?: boolean;
    notificationPreferences?: {
      email?: boolean;
      telegram?: boolean;
      push?: boolean;
    };
    tradingPreferences?: {
      defaultLeverage?: number;
      defaultMarginType?: string;
      defaultTimeInForce?: string;
    };
  };
  metadata?: Record<string, any>;
  updatedAt?: Date;
}

export interface IUserBase {
  email: string;
  username: string;
  password: string;
  name: string;
  role: UserRole;
  status: UserStatus;
  level: UserLevel;
  isAdmin: boolean;
  permissions: string[];
  balance: number;
  accountBalance: number;
  subscriptionFee: number;
  referrerId?: Types.ObjectId;
  referrer?: string;
}

export interface IUser extends IUserBase {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface IUserDocument extends Omit<Document, '_id'>, IUser {}

export interface IUserCreateInput {
  email: string;
  username: string;
  password: string;
  name: string;
  role?: UserRole;
  status?: UserStatus;
  level?: UserLevel;
  isAdmin?: boolean;
  permissions?: string[];
  balance?: number;
  accountBalance?: number;
  subscriptionFee?: number;
  referrerId?: Types.ObjectId;
  referrer?: string;
}

export interface IUserUpdateInput {
  email?: string;
  username?: string;
  password?: string;
  name?: string;
  role?: UserRole;
  status?: UserStatus;
  level?: UserLevel;
  isAdmin?: boolean;
  permissions?: string[];
  balance?: number;
  accountBalance?: number;
  subscriptionFee?: number;
  referrerId?: Types.ObjectId;
  referrer?: string;
}

export interface IUserLevel {
  _id: Types.ObjectId;
  level: UserLevel;
  minDeposit: number;
  maxDeposit: number;
  benefits: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserLevelDocument extends IUserLevel, Document {
  _id: Types.ObjectId;
}

export type UserCreateInput = Omit<IUserBase, 'isAdmin' | 'permissions' | 'balance' | 'accountBalance' | 'subscriptionFee' | 'referrerId' | 'referrer'> & {
  isAdmin?: boolean;
  permissions?: string[];
  balance?: number;
  accountBalance?: number;
  subscriptionFee?: number;
  referrerId?: Types.ObjectId;
  referrer?: string;
};

export type UserUpdateInput = Partial<Omit<IUserBase, 'password'>>;

export type UserLevelCreateInput = Omit<IUserLevel, '_id' | 'createdAt' | 'updatedAt'>;
export type UserLevelUpdateInput = Partial<UserLevelCreateInput>; 