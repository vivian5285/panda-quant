"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const strategyPerformanceSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: 'User' },
    strategyId: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: 'Strategy' },
    profit: { type: Number, required: true },
}, {
    timestamps: true
});
exports.default = (0, mongoose_1.model)('StrategyPerformance', strategyPerformanceSchema);
