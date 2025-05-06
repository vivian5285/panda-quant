import { Schema, model } from 'mongoose';
const CommissionRuleSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, required: true, enum: ['percentage', 'fixed'] },
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
export default model('CommissionRule', CommissionRuleSchema);
//# sourceMappingURL=CommissionRule.js.map