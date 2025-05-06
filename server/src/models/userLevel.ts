import { Schema, model } from 'mongoose';
import { IUserLevel } from '../types/UserLevel';

const userLevelSchema = new Schema<IUserLevel>({
  level: {
    type: Number,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  description: String,
  experience: {
    type: Number,
    required: true,
    default: 0
  },
  requiredExperience: {
    type: Number,
    required: true,
    default: 0
  },
  minCommission: {
    type: Number,
    required: true,
    default: 0
  },
  maxCommission: {
    type: Number,
    required: true,
    default: 0
  },
  requirements: {
    minBalance: { type: Number, default: 0 },
    minTrades: { type: Number, default: 0 },
    minVolume: { type: Number, default: 0 }
  },
  benefits: {
    commissionRate: { type: Number, default: 0 },
    withdrawalLimit: { type: Number, default: 0 },
    features: [{ type: String }]
  },
  achievements: {
    type: [String],
    default: []
  },
  metadata: {
    type: Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

export const UserLevel = model<IUserLevel>('UserLevel', userLevelSchema);
export default UserLevel; 