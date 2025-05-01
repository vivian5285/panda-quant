"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Trade = void 0;
const mongoose_1 = require("mongoose");
const tradeSchema = new mongoose_1.Schema({
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
    symbol: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['buy', 'sell'],
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'cancelled', 'failed'],
        default: 'pending'
    },
    metadata: {
        type: Map,
        of: mongoose_1.Schema.Types.Mixed
    }
}, {
    timestamps: true
});
exports.Trade = (0, mongoose_1.model)('Trade', tradeSchema);
exports.default = exports.Trade;
//# sourceMappingURL=Trade.js.map