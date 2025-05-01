"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Strategy = void 0;
const mongoose_1 = require("mongoose");
const strategy_1 = require("../types/strategy");
const strategySchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: String,
    type: {
        type: String,
        enum: Object.values(strategy_1.StrategyStatus),
        required: true
    },
    status: {
        type: String,
        enum: Object.values(strategy_1.StrategyStatus),
        default: strategy_1.StrategyStatus.ACTIVE
    },
    parameters: {
        type: mongoose_1.Schema.Types.Mixed,
        default: {}
    },
    performance: {
        totalTrades: { type: Number, default: 0 },
        winRate: { type: Number, default: 0 },
        profit: { type: Number, default: 0 },
        metrics: { type: mongoose_1.Schema.Types.Mixed, default: {} }
    },
    metadata: {
        type: mongoose_1.Schema.Types.Mixed,
        default: {}
    }
}, {
    timestamps: true
});
exports.Strategy = (0, mongoose_1.model)('Strategy', strategySchema);
exports.default = exports.Strategy;
//# sourceMappingURL=Strategy.js.map