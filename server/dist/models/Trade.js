import mongoose, { Schema } from 'mongoose';
const tradeSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    strategyId: { type: Schema.Types.ObjectId, ref: 'Strategy', required: true },
    symbol: { type: String, required: true },
    type: { type: String, enum: ['long', 'short'], required: true },
    side: { type: String, enum: ['buy', 'sell'], required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'executed', 'cancelled', 'failed'], default: 'pending' },
    executedAt: { type: Date },
    metadata: { type: Schema.Types.Mixed, default: {} },
    createdAt: { type: Date, default: Date.now }
}, {
    timestamps: true
});
// 添加索引
tradeSchema.index({ userId: 1 });
tradeSchema.index({ strategyId: 1 });
tradeSchema.index({ symbol: 1 });
tradeSchema.index({ status: 1 });
tradeSchema.index({ createdAt: -1 });
export const Trade = mongoose.model('Trade', tradeSchema);
export default Trade;
//# sourceMappingURL=Trade.js.map