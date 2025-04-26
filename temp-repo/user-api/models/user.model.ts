import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  username?: string;
  balance: number;
  hostingFee: number;
  subscriptionFee: number;  // 订阅费用
  accountBalance: number;   // 账户余额
  subscriptionEndDate: Date;  // 订阅结束日期
  status: 'active' | 'inactive' | 'suspended';
  referralCode: string;
  referralRewards: number;
  referredBy?: mongoose.Types.ObjectId;
  inviteCode?: string;
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  username: {
    type: String,
    unique: true,
    sparse: true
  },
  balance: {
    type: Number,
    default: 0
  },
  hostingFee: {
    type: Number,
    default: 0
  },
  subscriptionFee: {
    type: Number,
    default: 0
  },
  accountBalance: {
    type: Number,
    default: 0
  },
  subscriptionEndDate: {
    type: Date,
    default: null
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'inactive'
  },
  referralCode: {
    type: String,
    unique: true
  },
  referralRewards: {
    type: Number,
    default: 0
  },
  referredBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  inviteCode: {
    type: String,
    unique: true,
    sparse: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  }
}, {
  timestamps: true
});

// 密码比较方法
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// 保存前加密密码
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// 添加索引以提高查询性能
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });
userSchema.index({ inviteCode: 1 });
userSchema.index({ referralCode: 1 });
userSchema.index({ status: 1 });

// 静态方法
userSchema.statics.findByEmail = function(email: string) {
  return this.findOne({ email });
};

userSchema.statics.findByUsername = function(username: string) {
  return this.findOne({ username });
};

userSchema.statics.findByInviteCode = function(inviteCode: string) {
  return this.findOne({ inviteCode });
};

userSchema.statics.generateInviteCode = async function() {
  let inviteCode;
  let isUnique = false;
  
  while (!isUnique) {
    inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    const existingUser = await this.findOne({ inviteCode });
    if (!existingUser) {
      isUnique = true;
    }
  }
  
  return inviteCode;
};

export const User = mongoose.model<IUser>('User', userSchema); 