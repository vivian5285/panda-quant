import mongoose, { Schema, Document, Types } from 'mongoose';
import { CommissionType, CommissionStatus } from '../types/Enums';

export interface ICommission {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  amount: number;
  currency: string;
  type: CommissionType;
  status: CommissionStatus;
  description: string;
  referenceId: Types.ObjectId;
  referenceType: string;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICommissionDocument extends Omit<ICommission, '_id'>, Document {
  _id: Types.ObjectId;
}

const commissionSchema = new Schema<ICommissionDocument>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  type: { type: String, enum: Object.values(CommissionType), required: true },
  status: { type: String, enum: Object.values(CommissionStatus), required: true },
  description: { type: String, required: true },
  referenceId: { type: Schema.Types.ObjectId, required: true },
  referenceType: { type: String, required: true },
  metadata: { type: Schema.Types.Mixed, default: {} },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// 添加索引
commissionSchema.index({ userId: 1 });
commissionSchema.index({ type: 1 });
commissionSchema.index({ status: 1 });
commissionSchema.index({ currency: 1 });
commissionSchema.index({ createdAt: -1 });
commissionSchema.index({ referenceId: 1 });
commissionSchema.index({ referenceType: 1 });

export const Commission = mongoose.model<ICommissionDocument>('Commission', commissionSchema);
export default Commission; 