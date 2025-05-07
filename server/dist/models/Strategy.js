"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Strategy = void 0;
const mongoose_1 = require("mongoose");
const Enums_1 = require("../types/Enums");
const strategySchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, enum: Object.values(Enums_1.StrategyType), required: true },
    status: { type: String, enum: Object.values(Enums_1.StrategyStatus), default: Enums_1.StrategyStatus.PENDING },
    parameters: { type: mongoose_1.Schema.Types.Mixed, default: {} },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
// 添加中间件来自动更新updatedAt字段
strategySchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});
// 添加索引
strategySchema.index({ type: 1 });
strategySchema.index({ status: 1 });
strategySchema.index({ createdAt: -1 });
strategySchema.index({ userId: 1 });
exports.Strategy = (0, mongoose_1.model)('Strategy', strategySchema);
exports.default = exports.Strategy;
//# sourceMappingURL=Strategy.js.map