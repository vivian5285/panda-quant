import { Schema, model, Document, Types } from 'mongoose';
import { UserLevel } from '../types/Enums';
import { IUserLevel, IUserLevelDocument } from '../types/User';

const userLevelSchema = new Schema<IUserLevelDocument>({
  level: {
    type: String,
    enum: Object.values(UserLevel),
    required: true
  },
  minDeposit: {
    type: Number,
    required: true
  },
  maxDeposit: {
    type: Number,
    required: true
  },
  benefits: {
    type: [String],
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

export const UserLevelModel = model<IUserLevelDocument>('UserLevel', userLevelSchema);
export default UserLevelModel; 