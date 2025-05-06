"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StrategyRating = void 0;
const mongoose_1 = require("mongoose");
const strategyRatingSchema = new mongoose_1.Schema({
    strategyId: {
        type: mongoose_1.Types.ObjectId,
        ref: 'Strategy',
        required: true
    },
    userId: {
        type: mongoose_1.Types.ObjectId,
        ref: 'User',
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});
exports.StrategyRating = (0, mongoose_1.model)('StrategyRating', strategyRatingSchema);
//# sourceMappingURL=StrategyRating.js.map