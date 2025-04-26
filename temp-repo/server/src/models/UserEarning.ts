import mongoose, { Schema, Document } from 'mongoose';

export interface IUserEarning extends Document {
  userId: mongoose.Types.ObjectId;
  settlementId: mongoose.Types.ObjectId;
  amount: number;
  level: number;
  createdAt: Date;
}

const UserEarningSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  settlementId: { type: Schema.Types.ObjectId, ref: 'Settlement', required: true },
  amount: { type: Number, required: true },
  level: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

export const UserEarning = mongoose.model<IUserEarning>('UserEarning', UserEarningSchema); 