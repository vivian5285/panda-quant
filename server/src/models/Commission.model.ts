import mongoose, { Schema, Document } from 'mongoose';

export interface ICommission extends Document {
  userId: mongoose.Types.ObjectId;
  fromUser: mongoose.Types.ObjectId;
  amount: number;
  type: 'direct' | 'indirect';
  createdAt: Date;
}

const commissionSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fromUser: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ['direct', 'indirect'],
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const Commission = mongoose.model<ICommission>('Commission', commissionSchema); 