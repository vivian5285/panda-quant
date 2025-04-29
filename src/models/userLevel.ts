import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IUserLevel extends Document {
  _id: Types.ObjectId;
  name: string;
  minCommission: number;
  maxCommission: number;
  commissionRate: number;
  createdAt: Date;
  updatedAt: Date;
}

const userLevelSchema = new Schema<IUserLevel>({
  name: {
    type: String,
    required: true,
    unique: true
  },
  minCommission: {
    type: Number,
    required: true
  },
  maxCommission: {
    type: Number,
    required: true
  },
  commissionRate: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

export const UserLevel = mongoose.model<IUserLevel>('UserLevel', userLevelSchema); 