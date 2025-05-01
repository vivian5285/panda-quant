import { Schema, model, Document, Types } from 'mongoose';

export interface IWithdrawalDocument extends Document {
  userId: Types.ObjectId;
  amount: number;
  status: string;
  walletAddress: string;
  paymentMethod: 'crypto' | 'bank' | 'paypal';
  paymentDetails: Record<string, any>;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const withdrawalSchema = new Schema<IWithdrawalDocument>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'cancelled'],
    default: 'pending'
  },
  walletAddress: { type: String, required: true },
  paymentMethod: {
    type: String,
    enum: ['crypto', 'bank', 'paypal'],
    required: true
  },
  paymentDetails: { type: Schema.Types.Mixed, required: true },
  metadata: { type: Schema.Types.Mixed, default: {} }
}, {
  timestamps: true
});

export const Withdrawal = model<IWithdrawalDocument>('Withdrawal', withdrawalSchema);
export default Withdrawal; 