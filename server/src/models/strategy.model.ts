import { Schema, model, Document } from 'mongoose';
import { IStrategy } from '../types/strategy';

export enum StrategyStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PAUSED = 'paused',
  COMPLETED = 'completed'
}

export interface IStrategyDocument extends IStrategy, Document {
  createdAt: Date;
  updatedAt: Date;
}

const strategySchema = new Schema<IStrategyDocument>({
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  name: { type: String, required: true },
  description: { type: String, required: true },
  status: { 
    type: String, 
    enum: Object.values(StrategyStatus), 
    required: true, 
    default: StrategyStatus.ACTIVE 
  },
  parameters: { type: Schema.Types.Mixed },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

strategySchema.methods['toJSON'] = function() {
  const obj = this['toObject']();
  delete obj.__v;
  return obj;
};

export const Strategy = model<IStrategyDocument>('Strategy', strategySchema);
export default Strategy; 