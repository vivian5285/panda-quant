import mongoose, { Schema } from 'mongoose';
const strategySchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, required: true },
    status: { type: String, enum: ['active', 'inactive', 'pending'], default: 'pending' },
    parameters: { type: Schema.Types.Mixed, required: true },
    performance: {
        totalTrades: { type: Number, default: 0 },
        winRate: { type: Number, default: 0 },
        profit: { type: Number, default: 0 },
        metrics: { type: Schema.Types.Mixed, default: {} }
    },
    metadata: {
        type: Schema.Types.Mixed,
        default: {}
    },
    createdAt: { type: Date, default: Date.now }
}, {
    timestamps: true
});
// 添加中间件来自动更新updatedAt字段
strategySchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});
// 添加索引
strategySchema.index({ userId: 1 });
strategySchema.index({ type: 1 });
strategySchema.index({ status: 1 });
strategySchema.index({ createdAt: -1 });
export const Strategy = mongoose.model('Strategy', strategySchema);
export default Strategy;
//# sourceMappingURL=Strategy.js.map