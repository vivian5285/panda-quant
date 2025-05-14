import { Schema, model } from 'mongoose';
import { IUser } from '../types';

const UserSchema = new Schema<IUser>({
  id: { type: String, required: true },
  username: { type: String, required: true },
  email: { type: String, required: true },
  level: { type: String, required: true },
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date, required: true },
  password: { type: String, required: true },
  role: { type: String, required: true, enum: ['user', 'admin'], default: 'user' },
  referrerId: { type: Schema.Types.ObjectId, ref: 'User' },
}, {
  timestamps: true
});

export default model<IUser>('User', UserSchema); 