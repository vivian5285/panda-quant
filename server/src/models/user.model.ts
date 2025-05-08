import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser extends Document {
  email: string;
  password: string;
  username?: string;
  role: 'user' | 'admin';
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
  name?: string;
  status?: string;
  level?: string;
  permissions?: string[];
  resetToken?: string;
  resetTokenExpires?: Date;
  isAdmin?: boolean;
  balance?: number;
  accountBalance?: number;
  subscriptionFee?: number;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  username: { type: String },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  isActive: { type: Boolean, default: true },
  lastLogin: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  name: { type: String },
  status: { type: String },
  level: { type: String },
  permissions: [{ type: String }],
  resetToken: { type: String },
  resetTokenExpires: { type: Date },
  isAdmin: { type: Boolean, default: false },
  balance: { type: Number, default: 0 },
  accountBalance: { type: Number, default: 0 },
  subscriptionFee: { type: Number, default: 0 }
}, {
  timestamps: true
});

// 添加密码比较方法
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model<IUser>('User', userSchema); 