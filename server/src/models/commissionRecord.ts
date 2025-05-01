import { Schema, model, Document } from 'mongoose';

export interface ICommissionRecordDocument extends Document {
  userId: string;
  amount: number;
  type: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

const commissionRecordSchema = new Schema<ICommissionRecordDocument>({
  userId: { type: String, required: true },
  amount: { type: Number, required: true },
  type: { type: String, required: true },
  status: { type: String, required: true }
}, {
  timestamps: true
});

// 添加索引
commissionRecordSchema.index({ userId: 1 });
commissionRecordSchema.index({ status: 1 });
commissionRecordSchema.index({ createdAt: -1 });

// 在保存前更新 updatedAt
commissionRecordSchema.pre('save', function(next) {
  this['updatedAt'] = new Date();
  next();
});

export const CommissionRecord = model<ICommissionRecordDocument>('CommissionRecord', commissionRecordSchema);
export default CommissionRecord; 