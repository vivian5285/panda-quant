import mongoose, { Schema } from 'mongoose';
import { IUser } from '../types/User';

const userSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, enum: ['admin', 'user'] },
  status: { type: String, required: true, enum: ['active', 'inactive', 'suspended'] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  lastLogin: { type: Date },
  preferences: {
    theme: { type: String },
    notifications: { type: Boolean },
    language: { type: String }
  }
});

export const User = mongoose.model<IUser>('User', userSchema); 