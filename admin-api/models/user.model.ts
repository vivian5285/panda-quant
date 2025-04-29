import mongoose, { Schema, Document, Types } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  email: string;
  username?: string;
  password: string;
  walletAddress?: string;
  role: 'admin' | 'user';
  status: 'active' | 'inactive';
  isAdmin: boolean;
  adminType?: string;
  permissions: Record<string, any>;
  balance: number;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
  referralCode?: string;
  referredBy?: Types.ObjectId;
  name: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  username: { type: String },
  password: { type: String, required: true },
  walletAddress: { type: String },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  status: { type: String, required: true, enum: ['active', 'inactive'], default: 'active' },
  isAdmin: { type: Boolean, default: false },
  adminType: { type: String },
  permissions: { type: Schema.Types.Mixed, default: {} },
  balance: { type: Number, default: 0 },
  lastLogin: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  referralCode: { type: String, unique: true, sparse: true },
  referredBy: { type: Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true }
}, {
  timestamps: true
});

// 密码加密中间件
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// 密码比较方法
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// 创建索引
userSchema.index({ email: 1 });
userSchema.index({ status: 1 });
userSchema.index({ role: 1 });

// 添加创建管理员账号的静态方法
userSchema.statics.createAdmin = async function(email: string, password: string): Promise<IUser> {
  const hashedPassword = await bcrypt.hash(password, 10);
  return this.create({
    email,
    password: hashedPassword,
    role: 'admin',
    status: 'active',
    isAdmin: true,
    balance: 0,
    name: 'Admin User'
  });
};

export const User = mongoose.model<IUser>('User', userSchema); 