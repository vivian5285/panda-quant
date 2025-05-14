import { Schema, model } from 'mongoose';
import { IBlacklistEntry } from '../types';

const BlacklistEntrySchema = new Schema<IBlacklistEntry>({
  id: { type: String, required: true },
  symbol: { type: String, required: true },
  reason: { type: String, required: true },
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date, required: true },
  type: { type: String, required: true }
});

export default model<IBlacklistEntry>('BlacklistEntry', BlacklistEntrySchema); 