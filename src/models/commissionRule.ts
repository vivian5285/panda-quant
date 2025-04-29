import { Schema, model } from 'mongoose';

export interface ICommissionRule {
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

export const CommissionRule = model<ICommissionRule>('CommissionRule', commissionRuleSchema); 