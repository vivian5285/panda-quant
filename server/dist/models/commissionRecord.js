import { Schema, model } from 'mongoose';
const commissionRecordSchema = new Schema({
    userId: { type: String, required: true },
    amount: { type: Number, required: true },
    type: { type: String, required: true },
    status: { type: String, required: true }
}, {
    timestamps: true
});
// 添加索引
commissionRecordSchema.index({ userId: 1 });
commissionRecordSchema.index({ status: 1 });
commissionRecordSchema.index({ createdAt: -1 });
// 在保存前更新 updatedAt
commissionRecordSchema.pre('save', function (next) {
    this['updatedAt'] = new Date();
    next();
});
export const CommissionRecord = model('CommissionRecord', commissionRecordSchema);
export default CommissionRecord;
//# sourceMappingURL=CommissionRecord.js.map