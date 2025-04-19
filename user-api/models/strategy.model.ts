import mongoose, { Document, Schema } from 'mongoose';

export interface IStrategy extends Document {
  name: string;
  description: string;
  type: string;  // 策略类型
  riskLevel: '低' | '中等' | '较高';
  expectedReturn: number;  // 预计月化收益（百分比）
  active: boolean;  // 是否启用该策略
  status: string;  // 策略状态
  startTime: Date;  // 策略开始时间
  parameters: Record<string, any>;  // 策略参数
  createdAt: Date;
  updatedAt: Date;
}

const strategySchema = new Schema<IStrategy>({
  name: { 
    type: String, 
    required: [true, '策略名称不能为空'],
    trim: true,
    minlength: [2, '策略名称至少需要2个字符'],
    maxlength: [50, '策略名称不能超过50个字符']
  },
  description: { 
    type: String, 
    required: [true, '策略描述不能为空'],
    trim: true,
    minlength: [10, '策略描述至少需要10个字符'],
    maxlength: [500, '策略描述不能超过500个字符']
  },
  type: {
    type: String,
    required: [true, '策略类型不能为空'],
    trim: true
  },
  riskLevel: { 
    type: String, 
    required: [true, '风险等级不能为空'],
    enum: {
      values: ['低', '中等', '较高'],
      message: '风险等级必须是：低、中等或较高'
    }
  },
  expectedReturn: { 
    type: Number, 
    required: [true, '预期收益不能为空'],
    min: [0, '预期收益不能为负数'],
    max: [100, '预期收益不能超过100%']
  },
  active: { 
    type: Boolean, 
    default: true 
  },
  status: {
    type: String,
    required: [true, '策略状态不能为空'],
    default: 'inactive'
  },
  startTime: {
    type: Date,
    required: [true, '策略开始时间不能为空']
  },
  parameters: {
    type: Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true  // 自动添加 createdAt 和 updatedAt 字段
});

// 添加索引
strategySchema.index({ name: 1 }, { unique: true });
strategySchema.index({ active: 1 });
strategySchema.index({ riskLevel: 1 });

// 添加静态方法
strategySchema.statics.findActiveStrategies = function() {
  return this.find({ active: true });
};

strategySchema.statics.findByRiskLevel = function(level: string) {
  return this.find({ riskLevel: level, active: true });
};

export const Strategy = mongoose.model<IStrategy>('Strategy', strategySchema); 