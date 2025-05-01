"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StrategyPerformance = void 0;
const mongoose_1 = require("mongoose");
const strategyPerformanceSchema = new mongoose_1.Schema({
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
exports.StrategyPerformance = (0, mongoose_1.model)('StrategyPerformance', strategyPerformanceSchema);
exports.default = exports.StrategyPerformance;
//# sourceMappingURL=StrategyPerformance.js.map