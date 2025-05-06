import { Schema, model, Document, Types } from 'mongoose';
import { ISettlement, SettlementStatus } from '../types/Settlement';
import { SettlementType } from '../types/Enums';

export interface ISettlementDocument extends Omit<ISettlement, '_id'>, Document {
  _id: Types.ObjectId;
}

const SettlementSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  type: { type: String, required: true, enum: Object.values(SettlementType) },
  status: { type: String, required: true, enum: Object.values(SettlementStatus) },
  referenceId: { type: Schema.Types.ObjectId, ref: 'Commission', required: true },
  referenceType: { type: String, required: true },
  description: { type: String },
  metadata: { type: Schema.Types.Mixed },
  completedAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// 使用类型断言来解决类型不匹配问题
const SettlementModel = model<ISettlementDocument>('Settlement', SettlementSchema as any);
export default SettlementModel; 