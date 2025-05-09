import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ISettings {
  key: string;
  value: any;
  description: string;
  category: string;
  isSystem: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISettingsDocument extends Document {
  _id: Types.ObjectId;
  key: string;
  value: any;
  description: string;
  category: string;
  isSystem: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const settingsSchema = new Schema<ISettingsDocument>({
  key: { type: String, required: true, unique: true },
  value: { type: Schema.Types.Mixed, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  isSystem: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

settingsSchema.index({ key: 1 }, { unique: true });
settingsSchema.index({ category: 1 });

export const Settings = mongoose.model<ISettingsDocument>('Settings', settingsSchema);
export default Settings; 