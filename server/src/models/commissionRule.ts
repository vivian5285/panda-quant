import mongoose, { Schema, model, Document, Types } from 'mongoose';
import { ICommissionRule } from '../types/Commission';

export interface ICommissionRuleDocument extends Omit<ICommissionRule, '_id'>, Document {
  _id: Types.ObjectId;
}

const CommissionRuleSchema = new Schema<ICommissionRuleDocument>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, required: true, enum: ['percentage', 'fixed'] },
  value: { type: Number, required: true },
  conditions: {
    minVolume: { type: Number },
    maxVolume: { type: Number },
    maxTrades: { type: Number },
    minProfit: { type: Number },
    maxProfit: { type: Number },
    timeframes: [{ type: String }],
    pairs: [{ type: String }]
  },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// 添加索引
CommissionRuleSchema.index({ isActive: 1 });
CommissionRuleSchema.index({ 'conditions.minVolume': 1 });
CommissionRuleSchema.index({ 'conditions.maxVolume': 1 });

// 在保存前更新 updatedAt
CommissionRuleSchema.pre('save', function(this: ICommissionRuleDocument, next) {
  this.updatedAt = new Date();
  next();
});

export default model<ICommissionRuleDocument>('CommissionRule', CommissionRuleSchema); 