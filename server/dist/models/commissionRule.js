"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const Enums_1 = require("../types/Enums");
const CommissionRuleSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, required: true, enum: Object.values(Enums_1.CommissionType) },
    value: { type: Number, required: true },
    conditions: {
        minVolume: { type: Number },
        maxVolume: { type: Number },
        maxTrades: { type: Number },
        minProfit: { type: Number },
        maxProfit: { type: Number },
        timeframes: [{ type: String }],
        pairs: [{ type: String }]
    },
    isActive: { type: Boolean, default: true },
    status: { type: String, enum: Object.values(Enums_1.CommissionStatus), default: Enums_1.CommissionStatus.PENDING },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
// 添加索引
CommissionRuleSchema.index({ isActive: 1 });
CommissionRuleSchema.index({ 'conditions.minVolume': 1 });
CommissionRuleSchema.index({ 'conditions.maxVolume': 1 });
// 在保存前更新 updatedAt
CommissionRuleSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});
exports.default = (0, mongoose_1.model)('CommissionRule', CommissionRuleSchema);
//# sourceMappingURL=CommissionRule.js.map