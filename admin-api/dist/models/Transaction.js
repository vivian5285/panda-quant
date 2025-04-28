"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transaction = void 0;
const mongoose_1 = require("mongoose");
const transactionSchema = new mongoose_1.Schema({
    userId: { type: String, required: true },
    type: { type: String, required: true },
    amount: { type: Number, required: true },
    status: { type: String, required: true, default: 'pending' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
exports.Transaction = (0, mongoose_1.model)('Transaction', transactionSchema);
