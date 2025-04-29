import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IWithdrawal extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  amount: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

const withdrawalSchema = new Schema<IWithdrawal>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'approved', 'rejected', 'completed'],
    default: 'pending'
  }
}, {
  timestamps: true
});

export const Withdrawal = mongoose.model<IWithdrawal>('Withdrawal', withdrawalSchema); 