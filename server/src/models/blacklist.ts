import { Schema, model } from 'mongoose';
import { IBlacklistEntryDocument, BlacklistStatus, BlacklistType } from '../types/blacklist';

const blacklistSchema = new Schema<IBlacklistEntryDocument>({
  address: { type: String, required: true },
  type: { 
    type: String, 
    enum: Object.values(BlacklistType),
    required: true 
  },
  reason: { type: String, required: true },
  status: { 
    type: String, 
    enum: Object.values(BlacklistStatus),
    default: BlacklistStatus.ACTIVE,
    required: true 
  },
  expiresAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

blacklistSchema.pre('save', function(this: IBlacklistEntryDocument, next) {
  if (this.isModified()) {
    this.updatedAt = new Date();
  }
  next();
});

export const Blacklist = model<IBlacklistEntryDocument>('Blacklist', blacklistSchema); 