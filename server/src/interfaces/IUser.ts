import { Document } from 'mongoose';

export interface IUser extends Document {
  _id: string;
  username: string;
  email: string;
  password: string;
  permissions: string[];
  createdAt: Date;
  updatedAt: Date;
} 