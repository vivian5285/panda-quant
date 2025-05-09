import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IUserLevel {
  _id: Types.ObjectId;
  name: string;
  level: number;
  minDeposit: number;
  maxDeposit: number;
  commissionRate: number;
  experience: number;
  requiredExperience: number;
  minCommission: number;
  maxCommission: number;
  benefits: string[];
  achievements: string[];
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserLevelDocument extends Document {
  _id: Types.ObjectId;
  name: string;
  level: number;
  minDeposit: number;
  maxDeposit: number;
  commissionRate: number;
  experience: number;
  requiredExperience: number;
  minCommission: number;
  maxCommission: number;
  benefits: string[];
  achievements: string[];
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const userLevelSchema = new Schema<IUserLevelDocument>({
  name: { type: String, required: true },
  level: { type: Number, required: true, unique: true },
  minDeposit: { type: Number, required: true },
  maxDeposit: { type: Number, required: true },
  commissionRate: { type: Number, required: true },
  experience: { type: Number, required: true },
  requiredExperience: { type: Number, required: true },
  minCommission: { type: Number, required: true },
  maxCommission: { type: Number, required: true },
  benefits: [{ type: String }],
  achievements: [{ type: String }],
  metadata: { type: Schema.Types.Mixed, default: {} },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

userLevelSchema.index({ name: 1 });
userLevelSchema.index({ level: 1 });
userLevelSchema.index({ experience: 1 });

export const UserLevel = mongoose.model<IUserLevelDocument>('UserLevel', userLevelSchema);
export default UserLevel; 