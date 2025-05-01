import { Types, Document } from 'mongoose';

export interface IUser {
  _id: Types.ObjectId;
  id: string;
  email: string;
  password: string;
  name: string;
  username: string;
  role: string;
  level: number;
  status: string;
  permissions: string[];
  isAdmin: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUserBase {
  email: string;
  password: string;
  username: string;
  name: string;
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