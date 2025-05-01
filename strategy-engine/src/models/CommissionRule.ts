import mongoose from 'mongoose';

const commissionRuleSchema = new mongoose.Schema({
  level: {
    type: String,
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
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

export const CommissionRule = mongoose.model('CommissionRule', commissionRuleSchema); 