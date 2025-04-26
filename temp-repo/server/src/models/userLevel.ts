import mongoose, { Document, Schema } from 'mongoose';

export interface IUserLevel extends Document {
  name: string;
  description: string;
  benefits: string[];
  requirements: {
    minBalance: number;
    minTradingVolume: number;
    minHoldingTime: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const userLevelSchema = new Schema<IUserLevel>({
  name: {
    type: String,
    required: [true, '等级名称是必需的'],
    trim: true,
    minlength: [2, '等级名称至少需要2个字符'],
    maxlength: [50, '等级名称不能超过50个字符']
  },
  description: {
    type: String,
    required: [true, '等级描述是必需的'],
    trim: true,
    minlength: [10, '等级描述至少需要10个字符'],
    maxlength: [500, '等级描述不能超过500个字符']
  },
  benefits: [{
    type: String,
    required: [true, '等级权益是必需的'],
    trim: true,
    minlength: [2, '权益描述至少需要2个字符'],
    maxlength: [100, '权益描述不能超过100个字符']
  }],
  requirements: {
    minBalance: {
      type: Number,
      required: [true, '最低余额是必需的'],
      min: [0, '最低余额不能小于0']
    },
    minTradingVolume: {
      type: Number,
      required: [true, '最低交易量是必需的'],
      min: [0, '最低交易量不能小于0']
    },
    minHoldingTime: {
      type: Number,
      required: [true, '最低持仓时间是必需的'],
      min: [0, '最低持仓时间不能小于0']
    }
  }
}, {
  timestamps: true
});

// 添加索引
userLevelSchema.index({ name: 1 }, { unique: true });

// 添加验证中间件
userLevelSchema.pre('save', function(next) {
  if (this.benefits.length === 0) {
    next(new Error('至少需要一个等级权益'));
  } else {
    next();
  }
});

export const UserLevel = mongoose.model<IUserLevel>('UserLevel', userLevelSchema); 