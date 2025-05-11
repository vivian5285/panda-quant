import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IUserEarning {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  strategyId: Types.ObjectId;
  amount: number;
  currency: string;
  type: 'profit' | 'commission' | 'referral';
  status: 'pending' | 'completed' | 'failed';
  description: string;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserEarningDocument extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  strategyId: Types.ObjectId;
  amount: number;
  currency: string;
  type: 'profit' | 'commission' | 'referral';
  status: 'pending' | 'completed' | 'failed';
  description: string;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const userEarningSchema = new Schema<IUserEarningDocument>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  strategyId: { type: Schema.Types.ObjectId, ref: 'Strategy', required: true },
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  type: { type: String, enum: ['profit', 'commission', 'referral'], required: true },
  status: { type: String, enum: ['pending', 'completed', 'failed'], required: true },
  description: { type: String, required: true },
  metadata: { type: Schema.Types.Mixed, default: {} },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

userEarningSchema.index({ userId: 1 });
userEarningSchema.index({ strategyId: 1 });
userEarningSchema.index({ type: 1 });
userEarningSchema.index({ status: 1 });
userEarningSchema.index({ currency: 1 });
userEarningSchema.index({ createdAt: -1 });

export const UserEarning = mongoose.model<IUserEarningDocument>('UserEarning', userEarningSchema);
export default UserEarning; 