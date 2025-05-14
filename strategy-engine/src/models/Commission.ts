import { Schema, model } from 'mongoose';
import { ICommission } from '../types';

const CommissionSchema = new Schema<ICommission>({
  id: { type: String, required: true },
  symbol: { type: String, required: true },
  rate: { type: Number, required: true },
  minAmount: { type: Number, required: true },
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date, required: true },
  userId: { type: String, required: true }
});

export default model<ICommission>('Commission', CommissionSchema); 