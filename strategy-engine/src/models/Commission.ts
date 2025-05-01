import { Schema, model } from 'mongoose';
import { ICommission } from '../types';

const commissionSchema = new Schema<ICommission>({
  userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  amount: { type: Number, required: true },
  type: { type: String, required: true },
  status: { type: String, required: true, enum: ['pending', 'paid'], default: 'pending' },
}, {
  timestamps: true
});

export default model<ICommission>('Commission', commissionSchema); 