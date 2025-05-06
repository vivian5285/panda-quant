import { Document, Types } from 'mongoose';
import { UserRole, UserLevel, UserStatus } from './Enums';

export interface IUserBase {
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