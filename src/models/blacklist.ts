import { Schema, model, Document } from 'mongoose';

export type BlacklistType = 'spam' | 'fraud' | 'abuse' | 'other';
export type BlacklistStatus = 'active' | 'expired' | 'removed';

export interface IBlacklistEntry extends Document {
  userId: string;
  username: string;
  email: string;
  reason: string;
  type: BlacklistType;
  status: BlacklistStatus;
  expiresAt: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const blacklistSchema = new Schema<IBlacklistEntry>({
  userId: { type: String, required: true },
  username: { type: String, required: true },
  email: { type: String, required: true },
  reason: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['spam', 'fraud', 'abuse', 'other'],
    required: true 
  },
  status: { 
    type: String, 
    enum: ['active', 'expired', 'removed'],
    default: 'active'
  },
  expiresAt: { type: Date, required: true },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const Blacklist = model<IBlacklistEntry>('Blacklist', blacklistSchema); 