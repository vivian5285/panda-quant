import { Document, Types } from 'mongoose';

export interface IAdminBase {
  email: string;
  password: string;
  name: string;
  role: string;
  permissions: string[];
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAdmin extends IAdminBase {
  _id: Types.ObjectId;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface IAdminDocument extends Omit<Document, '_id'>, IAdmin {}

export interface IAdminCreateInput {
  email: string;
  password: string;
  name: string;
  role?: string;
  permissions?: string[];
  isActive?: boolean;
}

export interface IAdminUpdateInput {
  email?: string;
  password?: string;
  name?: string;
  role?: string;
  permissions?: string[];
  isActive?: boolean;
  lastLogin?: Date;
}

export type AdminCreateInput = Omit<IAdminBase, '_id' | 'createdAt' | 'updatedAt'>;
export type AdminUpdateInput = Partial<Omit<IAdminBase, 'password'>>; 