import mongoose, { Document, Schema } from 'mongoose';

export interface IBlacklistEntry extends Document {
  userId: string;
  username: string;
  email: string;
  reason: string;
  type: 'spam' | 'fraud' | 'abuse' | 'other';
  status: 'active' | 'expired';
  createdAt: Date;
  updatedAt: Date;
  expiresAt?: Date;
  notes?: string;
}

const blacklistSchema = new Schema<IBlacklistEntry>({
  userId: {
    type: String,
    required: [true, '用户ID是必需的'],
    trim: true
  },
  username: {
    type: String,
    required: [true, '用户名是必需的'],
    trim: true,
    minlength: [2, '用户名至少需要2个字符'],
    maxlength: [50, '用户名不能超过50个字符']
  },
  email: {
    type: String,
    required: [true, '邮箱是必需的'],
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, '请输入有效的邮箱地址']
  },
  reason: {
    type: String,
    required: [true, '加入黑名单原因是必需的'],
    trim: true,
    minlength: [10, '原因描述至少需要10个字符'],
    maxlength: [500, '原因描述不能超过500个字符']
  },
  type: {
    type: String,
    required: [true, '黑名单类型是必需的'],
    enum: {
      values: ['spam', 'fraud', 'abuse', 'other'],
      message: '无效的黑名单类型'
    }
  },
  status: {
    type: String,
    required: [true, '状态是必需的'],
    enum: {
      values: ['active', 'expired'],
      message: '无效的状态'
    },
    default: 'active'
  },
  expiresAt: {
    type: Date,
    validate: {
      validator: function(value: Date) {
        return !value || value > new Date();
      },
      message: '过期时间必须大于当前时间'
    }
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [1000, '备注不能超过1000个字符']
  }
}, {
  timestamps: true
});

// 添加索引
blacklistSchema.index({ userId: 1 });
blacklistSchema.index({ email: 1 });
blacklistSchema.index({ status: 1 });
blacklistSchema.index({ createdAt: -1 });

// 添加验证中间件
blacklistSchema.pre('save', function(next) {
  if (this.expiresAt && this.expiresAt <= new Date()) {
    this.status = 'expired';
  }
  next();
});

export const BlacklistEntry = mongoose.model<IBlacklistEntry>('BlacklistEntry', blacklistSchema); 