import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser {
  email: string;
  password: string;
  name: string;
  isStrategyRunning: boolean;
  boundStrategy: string;
  riskLevel: 'high' | 'medium' | 'low';
  bindType: 'recharge' | 'api';
  accountBalance: number;
  strategyStartTime?: Date;
  apiKey?: string;
  apiSecret?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    isStrategyRunning: { type: Boolean, default: false },
    boundStrategy: { type: String },
    riskLevel: { type: String, enum: ['high', 'medium', 'low'] },
    bindType: { type: String, enum: ['recharge', 'api'] },
    accountBalance: { type: Number, default: 0 },
    strategyStartTime: { type: Date },
    apiKey: { type: String },
    apiSecret: { type: String }
  },
  {
    timestamps: true
  }
);

// 添加索引以提高查询性能
userSchema.index({ email: 1 });
userSchema.index({ name: 1 });

// 密码加密中间件
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// 验证密码方法
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model<IUser>('User', userSchema);

export default User; 