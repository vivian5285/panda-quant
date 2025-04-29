import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ICommissionRecord extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  referrerId: Types.ObjectId;
  amount: number;
  type: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

const commissionRecordSchema = new Schema<ICommissionRecord>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  referrerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

export const CommissionRecord = mongoose.model<ICommissionRecord>('CommissionRecord', commissionRecordSchema); 