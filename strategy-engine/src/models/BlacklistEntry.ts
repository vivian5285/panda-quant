import { Schema, model } from 'mongoose';
import { IBlacklistEntry } from '../types';

const blacklistEntrySchema = new Schema<IBlacklistEntry>({
  type: { type: String, required: true },
  value: { type: String, required: true },
  reason: { type: String, required: true },
}, {
  timestamps: true
});

export default model<IBlacklistEntry>('BlacklistEntry', blacklistEntrySchema); 