"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StrategyReview = void 0;
const mongoose_1 = require("mongoose");
const strategyReviewSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    strategyId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Strategy',
        required: true
    },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, {
    timestamps: true
});
// 添加索引
strategyReviewSchema.index({ userId: 1 });
strategyReviewSchema.index({ strategyId: 1 });
strategyReviewSchema.index({ createdAt: -1 });
exports.StrategyReview = (0, mongoose_1.model)('StrategyReview', strategyReviewSchema);
exports.default = exports.StrategyReview;
//# sourceMappingURL=StrategyReview.js.map