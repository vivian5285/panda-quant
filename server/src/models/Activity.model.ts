import { Schema, model } from 'mongoose';
import { IActivityDocument, ActivityType } from '../types/Activity';

const activitySchema = new Schema<IActivityDocument>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['LOGIN', 'LOGOUT', 'TRADE', 'WITHDRAW', 'DEPOSIT', 'API_KEY', 'SETTINGS', 'OTHER'],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  data: {
    type: Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

export const Activity = model<IActivityDocument>('Activity', activitySchema); 