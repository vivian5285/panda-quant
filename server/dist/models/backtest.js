import mongoose, { Schema } from 'mongoose';
const backtestSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    strategyId: { type: Schema.Types.ObjectId, ref: 'Strategy', required: true },
    name: { type: String, required: true },
    description: { type: String },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    initialBalance: { type: Number, required: true },
    finalBalance: { type: Number, required: true },
    totalReturn: { type: Number, required: true },
    annualizedReturn: { type: Number, required: true },
    averageTrade: { type: Number, required: true },
    trades: [{
            symbol: { type: String, required: true },
            type: { type: String, enum: ['long', 'short'], required: true },
            entryPrice: { type: Number, required: true },
            exitPrice: { type: Number, required: true },
            quantity: { type: Number, required: true },
            profit: { type: Number, required: true },
            timestamp: { type: Date, required: true }
        }],
    parameters: { type: Schema.Types.Mixed, required: true },
    status: { type: String, enum: ['running', 'completed', 'failed'], default: 'running' },
    createdAt: { type: Date, default: Date.now }
}, {
    timestamps: true
});
// 添加索引
backtestSchema.index({ userId: 1 });
backtestSchema.index({ strategyId: 1 });
backtestSchema.index({ status: 1 });
backtestSchema.index({ createdAt: -1 });
export const Backtest = mongoose.model('Backtest', backtestSchema);
export default Backtest;
//# sourceMappingURL=Backtest.js.map