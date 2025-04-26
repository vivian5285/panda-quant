import mongoose, { Schema, Document } from 'mongoose';

export interface ICommission extends Document {
  userId: mongoose.Types.ObjectId;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  details?: any;
  createdAt: Date;
  updatedAt: Date;
}

const CommissionSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
  details: { type: Schema.Types.Mixed },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const Commission = mongoose.model<ICommission>('Commission', CommissionSchema); 