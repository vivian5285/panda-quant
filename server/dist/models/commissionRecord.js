"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommissionRecord = void 0;
const mongoose_1 = require("mongoose");
const commissionRecordSchema = new mongoose_1.Schema({
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
exports.CommissionRecord = (0, mongoose_1.model)('CommissionRecord', commissionRecordSchema);
exports.default = exports.CommissionRecord;
//# sourceMappingURL=CommissionRecord.js.map