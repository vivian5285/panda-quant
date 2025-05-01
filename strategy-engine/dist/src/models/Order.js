"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const types_1 = require("../types");
const orderSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: 'User' },
    strategyId: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: 'Strategy' },
    symbol: { type: String, required: true },
    side: { type: String, required: true, enum: ['buy', 'sell'] },
    type: { type: String, required: true, enum: ['market', 'limit'] },
    price: { type: Number },
    amount: { type: Number, required: true },
    status: { type: String, required: true, enum: Object.values(types_1.OrderStatus), default: types_1.OrderStatus.PENDING },
}, {
    timestamps: true
});
exports.default = (0, mongoose_1.model)('Order', orderSchema);
