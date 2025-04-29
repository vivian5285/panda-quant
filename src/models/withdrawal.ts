import { Schema, model, Types } from 'mongoose';

export interface IWithdrawal {
  userId: Types.ObjectId;
  amount: number;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}

const withdrawalSchema = new Schema<IWithdrawal>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected', 'completed'],
    default: 'pending'
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const Withdrawal = model<IWithdrawal>('Withdrawal', withdrawalSchema); 