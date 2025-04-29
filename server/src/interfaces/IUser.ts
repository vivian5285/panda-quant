import { Document } from 'mongoose';

export interface IUser extends Document {
  _id: string;
  id: string;
  username: string;
  email: string;
  password: string;
  role: string;
  permissions: string[];
  referrerId?: string;
  createdAt: Date;
  updatedAt: Date;
} 