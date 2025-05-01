"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommissionWithdrawal = void 0;
const mongoose_1 = require("mongoose");
const commissionWithdrawalSchema = new mongoose_1.Schema({
    userId: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    },
    paymentMethod: {
        type: String,
        required: true
    },
    paymentDetails: {
        type: Map,
        of: mongoose_1.Schema.Types.Mixed,
        required: true
    },
    description: {
        type: String
    },
    metadata: {
        type: Map,
        of: mongoose_1.Schema.Types.Mixed
    }
}, {
    timestamps: true
});
// 添加索引
commissionWithdrawalSchema.index({ userId: 1 });
commissionWithdrawalSchema.index({ status: 1 });
commissionWithdrawalSchema.index({ createdAt: -1 });
// 在保存前更新 updatedAt
commissionWithdrawalSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});
exports.CommissionWithdrawal = (0, mongoose_1.model)('CommissionWithdrawal', commissionWithdrawalSchema);
//# sourceMappingURL=CommissionWithdrawal.js.map