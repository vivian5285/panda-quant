"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
const mongoose_1 = require("mongoose");
const orderSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    strategyId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Strategy', required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'completed', 'cancelled', 'failed'], default: 'pending' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, {
    timestamps: true
});
// 添加索引
orderSchema.index({ userId: 1 });
orderSchema.index({ strategyId: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });
// 在保存前更新 updatedAt
orderSchema.pre('save', function (next) {
    this.set('updatedAt', new Date());
    next();
});
exports.Order = (0, mongoose_1.model)('Order', orderSchema);
//# sourceMappingURL=Order.js.map