import { Types } from 'mongoose';
import { UserRole } from './Enums';

export interface IUser {
  _id: Types.ObjectId;
  username: string;
  email: string;
  password: string;
  role: UserRole;
  referrerId?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserProfile {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  country?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserSettings {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  theme: 'light' | 'dark';
  language: string;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
} 