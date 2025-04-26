import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IStrategy extends Document {
  _id: Types.ObjectId;
  name: string;
  description: string;
  userId: Types.ObjectId;
  status: 'active' | 'inactive' | 'paused';
  createdAt: Date;
  updatedAt: Date;
}

const strategySchema = new Schema<IStrategy>({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'paused'],
    default: 'active'
  }
}, {
  timestamps: true
});

export const Strategy = mongoose.model<IStrategy>('Strategy', strategySchema); 