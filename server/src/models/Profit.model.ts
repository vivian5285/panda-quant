import { Schema, model, Types } from 'mongoose';
import { ProfitType, ProfitStatus } from '../types/Enums';

interface IProfitBase {
  userId: Types.ObjectId;
  strategyId: Types.ObjectId;
  amount: number;
  type: ProfitType;
  status: ProfitStatus;
  metadata?: Record<string, any>;
}

interface IProfit extends IProfitBase {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

interface IProfitDocument extends IProfit {
  _id: Types.ObjectId;
}

const profitSchema = new Schema<IProfitDocument>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  strategyId: { type: Schema.Types.ObjectId, ref: 'Strategy', required: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: Object.values(ProfitType), required: true },
  status: { type: String, enum: Object.values(ProfitStatus), required: true },
  metadata: { type: Schema.Types.Mixed, default: {} }
}, {
  timestamps: true
});

// 添加复合索引
profitSchema.index({ userId: 1 });
profitSchema.index({ strategyId: 1 });
profitSchema.index({ status: 1 });
profitSchema.index({ createdAt: 1 });

const Profit = model<IProfitDocument>('Profit', profitSchema);
export type { IProfit, IProfitDocument };
export default Profit; 