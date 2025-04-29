import { Schema, model, Document } from 'mongoose';

export interface ICommissionRule extends Document {
  level: number;
  rate: number;
  minAmount: number;
  maxAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

const commissionRuleSchema = new Schema<ICommissionRule>({
  level: { type: Number, required: true },
  rate: { type: Number, required: true },
  minAmount: { type: Number, required: true },
  maxAmount: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// 添加索引
commissionRuleSchema.index({ level: 1 }, { unique: true });

// 添加中间件
commissionRuleSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export const CommissionRule = model<ICommissionRule>('CommissionRule', commissionRuleSchema);
export default CommissionRule; 