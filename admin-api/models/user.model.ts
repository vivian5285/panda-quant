import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  email: string;
  password: string;
  balance: number;
  status: 'active' | 'suspended' | 'inactive';
  role: 'user' | 'admin';
  referralCode?: string;
  referredBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  balance: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['active', 'suspended', 'inactive'],
    default: 'active',
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  referralCode: {
    type: String,
    unique: true,
    sparse: true,
  },
  referredBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
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
userSchema.statics.createAdmin = async function(email: string, password: string) {
  const admin = new this({
    email,
    password,
    role: 'admin',
    status: 'active',
    balance: 0
  });
  return await admin.save();
};

export const User = mongoose.model<IUser>('User', userSchema); 