import { Schema, model, Document } from 'mongoose';
import { CommissionStatus, CommissionType } from '../types/enums';

export interface ICommission extends Document {
  userId: Schema.Types.ObjectId;
  amount: number;
  type: CommissionType;
  status: CommissionStatus;
  description?: string;
  referenceId?: string;
  referenceType?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const CommissionSchema = new Schema<ICommission>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    type: { type: String, enum: Object.values(CommissionType), required: true },
    status: { type: String, enum: Object.values(CommissionStatus), default: CommissionStatus.PENDING },
    description: { type: String },
    referenceId: { type: String },
    referenceType: { type: String },
    metadata: { type: Schema.Types.Mixed }
  },
  { timestamps: true }
);

export const Commission = model<ICommission>('Commission', CommissionSchema); 