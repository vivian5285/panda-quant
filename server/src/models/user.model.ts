import mongoose, { Schema, Document, Types } from 'mongoose';
import bcrypt from 'bcrypt';
import { UserLevel } from '../types/Enums';

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  name: string;
  role: 'user' | 'admin';
  status: 'active' | 'inactive' | 'suspended';
  level: UserLevel;
  permissions: string[];
  referrerId?: Types.ObjectId;
  referrer?: string;
  isAdmin: boolean;
  balance: number;
  accountBalance: number;
  subscriptionFee: number;
  resetToken?: string;
  resetTokenExpires?: Date;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    default: ''
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },
  level: {
    type: String,
    enum: Object.values(UserLevel),
    default: UserLevel.BASIC
  },
  permissions: [{
    type: String
  }],
  referrerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  referrer: {
    type: String
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  balance: {
    type: Number,
    default: 0
  },
  accountBalance: {
    type: Number,
    default: 0
  },
  subscriptionFee: {
    type: Number,
    default: 0
  },
  resetToken: {
    type: String
  },
  resetTokenExpires: {
    type: Date
  },
  lastLogin: {
    type: Date
  }
}, {
  timestamps: true
});

// 添加密码比较方法
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// 密码加密中间件
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

export const User = mongoose.model<IUser>('User', userSchema);
export default User; 