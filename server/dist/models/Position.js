"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Position = void 0;
const mongoose_1 = require("mongoose");
const positionSchema = new mongoose_1.Schema({
    userId: { type: String, required: true },
    symbol: { type: String, required: true },
    quantity: { type: Number, required: true },
    entryPrice: { type: Number, required: true },
    currentPrice: { type: Number, required: true },
    unrealizedPnL: { type: Number, default: 0 },
    realizedPnL: { type: Number, default: 0 },
    status: { type: String, enum: ['open', 'closed'], default: 'open' }
}, {
    timestamps: true
});
// 添加索引
positionSchema.index({ userId: 1 });
positionSchema.index({ symbol: 1 });
positionSchema.index({ status: 1 });
positionSchema.index({ createdAt: -1 });
exports.Position = (0, mongoose_1.model)('Position', positionSchema);
//# sourceMappingURL=Position.js.map