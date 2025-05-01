import { Schema, model } from 'mongoose';
import { IUserLevel } from '../types';

const userLevelSchema = new Schema<IUserLevel>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  requirements: { type: Schema.Types.Mixed, required: true },
  benefits: { type: Schema.Types.Mixed, required: true },
}, {
  timestamps: true
});

export default model<IUserLevel>('UserLevel', userLevelSchema); 