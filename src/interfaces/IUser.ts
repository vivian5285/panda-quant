import { Types } from 'mongoose';

export interface IUser {
  _id: Types.ObjectId;
  id: string;
  role: string;
  permissions: string[];
  email: string;
  username: string;
  referrerId?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
} 