import type { Document, Types } from 'mongoose';
import type { UserRole, UserLevel, UserStatus } from './Enums';

export interface UserBase {
  email: string;
  password: string;
  name: string;
  username: string;
  role: UserRole;
  level: number;
  status: UserStatus;
  permissions: string[];
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
  balance: number;
  accountBalance: number;
  subscriptionFee: number;
}

export interface User extends Document, UserBase {
  _id: Types.ObjectId;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export type UserDocument = User;

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