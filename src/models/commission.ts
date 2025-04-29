import mongoose, { Schema, Document, Types } from 'mongoose';
import { ICommission } from '../interfaces/ICommission';

export interface ICommissionDocument extends ICommission, Document {}

const commissionSchema = new Schema<ICommissionDocument>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  referrerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  rate: { type: Number, required: true },
  commission: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'paid', 'cancelled'], default: 'pending' },
  type: { type: String, enum: ['direct', 'indirect'], required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// 添加索引
commissionSchema.index({ userId: 1 });
commissionSchema.index({ referrerId: 1 });
commissionSchema.index({ status: 1 });

// 添加中间件
commissionSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export const Commission = mongoose.model<ICommissionDocument>('Commission', commissionSchema);
export default Commission; 