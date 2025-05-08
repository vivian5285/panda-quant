import mongoose, { Schema, Document } from 'mongoose';

export interface SettingsDocument extends Document {
  key: string;
  value: any;
  description: string;
  category: string;
  isSystem: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const settingsSchema = new Schema({
  key: { type: String, required: true, unique: true },
  value: { type: Schema.Types.Mixed, required: true },
  description: { type: String },
  category: { type: String, required: true },
  isSystem: { type: Boolean, default: false }
}, {
  timestamps: true
});

settingsSchema.index({ key: 1 }, { unique: true });
settingsSchema.index({ category: 1 });

export const Settings = mongoose.model<SettingsDocument>('Settings', settingsSchema); 