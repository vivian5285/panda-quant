"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Backtest = void 0;
const mongoose_1 = require("mongoose");
const backtestSchema = new mongoose_1.Schema({
    strategyId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Strategy', required: true },
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    initialBalance: { type: Number, required: true },
    finalBalance: { type: Number, required: true },
    totalReturn: { type: Number, required: true },
    annualizedReturn: { type: Number, required: true },
    sharpeRatio: { type: Number, required: true },
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
exports.Backtest = (0, mongoose_1.model)('Backtest', backtestSchema);
exports.default = exports.Backtest;
//# sourceMappingURL=backtest.js.map