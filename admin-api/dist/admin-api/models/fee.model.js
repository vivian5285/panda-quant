"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Fee = void 0;
const mongoose_1 = require("mongoose");
const feeSchema = new mongoose_1.Schema({
    userId: { type: String, required: true },
    amount: { type: Number, required: true },
    type: { type: String, required: true },
    status: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
exports.Fee = (0, mongoose_1.model)('Fee', feeSchema);
