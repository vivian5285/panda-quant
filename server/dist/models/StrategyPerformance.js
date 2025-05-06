import { Schema, model } from 'mongoose';
const strategyPerformanceSchema = new Schema({
    strategyId: { type: String, required: true },
    period: {
        start: { type: Date, required: true },
        end: { type: Date, required: true }
    },
    totalReturn: { type: Number, required: true },
    annualizedReturn: { type: Number, required: true },
    sharpeRatio: { type: Number, required: true },
    sortinoRatio: { type: Number, required: true },
    maxDrawdown: { type: Number, required: true },
    winRate: { type: Number, required: true },
    profitFactor: { type: Number, required: true },
    averageTrade: { type: Number, required: true },
    totalTrades: { type: Number, required: true },
    winningTrades: { type: Number, required: true },
    losingTrades: { type: Number, required: true }
}, {
    timestamps: true
});
export const StrategyPerformance = model('StrategyPerformance', strategyPerformanceSchema);
export default StrategyPerformance;
//# sourceMappingURL=StrategyPerformance.js.map