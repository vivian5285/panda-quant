import mongoose, { Schema } from 'mongoose';
const alertSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['price', 'volume', 'technical', 'strategy_loss', 'news', 'system'], required: true },
    condition: { type: String, required: true },
    value: { type: Number, required: true },
    status: { type: String, enum: ['active', 'triggered', 'disabled'], default: 'active' },
    exchange: { type: String, required: true },
    symbol: { type: String, required: true },
    timeframe: { type: String },
    triggeredAt: { type: Date },
    error: { type: String },
    metadata: { type: Schema.Types.Mixed },
    message: { type: String, required: true },
    data: { type: Schema.Types.Mixed },
    isRead: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, {
    timestamps: true
});
// 添加中间件来自动更新updatedAt字段
alertSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});
export const Alert = mongoose.model('Alert', alertSchema);
//# sourceMappingURL=Alert.js.map