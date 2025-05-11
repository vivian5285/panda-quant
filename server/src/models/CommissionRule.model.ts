import mongoose, { Schema, Document } from 'mongoose';

export interface ICommissionRule extends Document {
  level: number;
  rate: number;
  minAmount: number;
  maxAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

const commissionRuleSchema = new Schema<ICommissionRule>({
  level: {
    type: Number,
    required: true,
    unique: true
  },
  rate: {
    type: Number,
    required: true,
    min: 0,
    max: 1
  },
  minAmount: {
    type: Number,
    required: true,
    min: 0
  },
  maxAmount: {
    type: Number,
    required: true,
    min: 0
  }
}, {
  timestamps: true
});

export const CommissionRule = mongoose.model<ICommissionRule>('CommissionRule', commissionRuleSchema);
export default CommissionRule; 