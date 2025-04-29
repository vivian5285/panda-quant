import { Schema, model } from 'mongoose';
import { User } from '../types/user';

const userSchema = new Schema<User>({
  id: { type: String, required: true },
  role: { type: String, required: true },
  permissions: [{ type: String }],
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  referrerId: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const UserModel = model<User>('User', userSchema); 