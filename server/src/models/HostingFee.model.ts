import mongoose, { Schema, Document } from 'mongoose';

export interface IHostingFee extends Document {
  userId: mongoose.Types.ObjectId;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
  createdAt: Date;
}

const hostingFeeSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['paid', 'pending', 'failed'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const HostingFee = mongoose.model<IHostingFee>('HostingFee', hostingFeeSchema); 