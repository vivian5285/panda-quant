import mongoose, { Schema, Document } from 'mongoose';

export interface IFee extends Document {
  userId: mongoose.Types.ObjectId;
  amount: number;
  type: 'hosting' | 'service';
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  createdAt: Date;
  updatedAt: Date;
}

const FeeSchema = new Schema({
  userId: {
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
    enum: ['hosting', 'service'],
    required: true
  },
  status: {
    type: String,
    enum: ['PENDING', 'COMPLETED', 'FAILED'],
    default: 'PENDING'
  }
}, {
  timestamps: true
});

export const Fee = mongoose.model<IFee>('Fee', FeeSchema); 