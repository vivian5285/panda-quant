import { Schema, model, Types } from 'mongoose';
import { ICommission } from '../interfaces/ICommission';

const commissionSchema = new Schema<ICommission>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  fromUserId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  level: { type: Number, required: true },
  strategyId: { type: Schema.Types.ObjectId, ref: 'Strategy', required: true },
  performanceId: { type: Schema.Types.ObjectId, ref: 'Performance', required: true },
  status: { type: String, enum: ['pending', 'paid'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const Commission = model<ICommission>('Commission', commissionSchema); 