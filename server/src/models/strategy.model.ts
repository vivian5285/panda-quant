import mongoose, { Schema } from 'mongoose';
import { IStrategy, IStrategyDocument } from '../types/Strategy';
import { StrategyStatus } from '../types/Enums';

const strategySchema = new Schema<IStrategyDocument>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, required: true },
  status: { type: String, enum: Object.values(StrategyStatus), default: StrategyStatus.ACTIVE },
  parameters: { type: Schema.Types.Mixed, required: true },
  createdAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

export const Strategy = mongoose.model<IStrategyDocument>('Strategy', strategySchema);
export default Strategy; 