import mongoose, { Schema, Document, Types } from 'mongoose';
import { CommissionType, CommissionStatus } from '../types/Enums';

export interface ICommissionRule {
  _id: Types.ObjectId;
  name: string;
  description: string;
  type: CommissionType;
  value: number;
  conditions: {
    minVolume?: number;
    maxVolume?: number;
    maxTrades?: number;
    minProfit?: number;
    maxProfit?: number;
    timeframes?: string[];
    pairs?: string[];
  };
  isActive: boolean;
  status: CommissionStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICommissionRuleDocument extends Omit<ICommissionRule, '_id'>, Document {
  _id: Types.ObjectId;
}

const commissionRuleSchema = new Schema<ICommissionRuleDocument>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, enum: Object.values(CommissionType), required: true },
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
  status: { type: String, enum: Object.values(CommissionStatus), required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

commissionRuleSchema.index({ name: 1 });
commissionRuleSchema.index({ type: 1 });
commissionRuleSchema.index({ status: 1 });
commissionRuleSchema.index({ isActive: 1 });
commissionRuleSchema.index({ createdAt: -1 });

export const CommissionRule = mongoose.model<ICommissionRuleDocument>('CommissionRule', commissionRuleSchema);
export default CommissionRule; 