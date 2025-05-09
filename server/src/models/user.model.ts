import mongoose, { Schema, Document, Types } from 'mongoose';
import bcrypt from 'bcrypt';
import { UserLevel } from '../types/Enums';

export interface IUser {
  _id: Types.ObjectId;
  email: string;
  password: string;
  name: string;
  role: 'user' | 'admin';
  status: 'active' | 'inactive' | 'banned';
  level: number;
  isAdmin: boolean;
  permissions: string[];
  resetToken?: string;
  balance: {
    available: number;
    locked: number;
    currency: string;
  };
  settings: {
    twoFactorEnabled: boolean;
    notificationPreferences: {
      email: boolean;
      telegram: boolean;
      push: boolean;
    };
    tradingPreferences: {
      defaultLeverage: number;
      defaultMarginType: string;
      defaultTimeInForce: string;
    };
  };
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserDocument extends Document {
  _id: Types.ObjectId;
  email: string;
  password: string;
  name: string;
  role: 'user' | 'admin';
  status: 'active' | 'inactive' | 'banned';
  level: number;
  isAdmin: boolean;
  permissions: string[];
  resetToken?: string;
  balance: {
    available: number;
    locked: number;
    currency: string;
  };
  settings: {
    twoFactorEnabled: boolean;
    notificationPreferences: {
      email: boolean;
      telegram: boolean;
      push: boolean;
    };
    tradingPreferences: {
      defaultLeverage: number;
      defaultMarginType: string;
      defaultTimeInForce: string;
    };
  };
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUserDocument>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  status: { type: String, enum: ['active', 'inactive', 'banned'], default: 'active' },
  level: { type: Number, default: 1 },
  isAdmin: { type: Boolean, default: false },
  permissions: [{ type: String }],
  resetToken: { type: String },
  balance: {
    available: { type: Number, default: 0 },
    locked: { type: Number, default: 0 },
    currency: { type: String, default: 'USDT' }
  },
  settings: {
    twoFactorEnabled: { type: Boolean, default: false },
    notificationPreferences: {
      email: { type: Boolean, default: true },
      telegram: { type: Boolean, default: false },
      push: { type: Boolean, default: true }
    },
    tradingPreferences: {
      defaultLeverage: { type: Number, default: 1 },
      defaultMarginType: { type: String, default: 'isolated' },
      defaultTimeInForce: { type: String, default: 'GTC' }
    }
  },
  metadata: { type: Schema.Types.Mixed, default: {} },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ name: 1 });
userSchema.index({ role: 1 });
userSchema.index({ status: 1 });
userSchema.index({ level: 1 });
userSchema.index({ createdAt: -1 });

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

export const User = mongoose.model<IUserDocument>('User', userSchema);
export default User; 