import { Schema, model } from 'mongoose';
import { IUser } from '../types';

const userSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, enum: ['user', 'admin'], default: 'user' },
  referrerId: { type: Schema.Types.ObjectId, ref: 'User' },
}, {
  timestamps: true
});

export default model<IUser>('User', userSchema); 