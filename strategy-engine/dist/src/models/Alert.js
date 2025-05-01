"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const alertSchema = new mongoose_1.Schema({
    userId: { type: String, required: true },
    type: { type: String, required: true, enum: ['price', 'volume', 'technical'] },
    condition: { type: String, required: true },
    value: { type: Number, required: true },
    status: { type: String, required: true, enum: ['active', 'triggered', 'disabled'], default: 'active' },
}, {
    timestamps: true
});
exports.default = (0, mongoose_1.model)('Alert', alertSchema);
