import mongoose, { Schema, Document, Types } from 'mongoose';
import { IBlacklistEntry, IBlacklistEntryDocument, BlacklistType, BlacklistStatus } from '../types/Blacklist';

const blacklistSchema = new Schema<IBlacklistEntryDocument>({
  type: { type: String, enum: Object.values(BlacklistType), required: true },
  value: { type: String, required: true },
  reason: { type: String, required: true },
  status: { type: String, enum: Object.values(BlacklistStatus), required: true },
  address: { type: String, required: true },
  metadata: { type: Schema.Types.Mixed, default: {} },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

blacklistSchema.index({ type: 1 });
blacklistSchema.index({ value: 1 });
blacklistSchema.index({ status: 1 });
blacklistSchema.index({ address: 1 });
blacklistSchema.index({ createdAt: -1 });

export const Blacklist = mongoose.model<IBlacklistEntryDocument>('Blacklist', blacklistSchema);
export default Blacklist; 