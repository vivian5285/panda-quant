"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const strategySchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    userId: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: 'User' },
    parameters: { type: mongoose_1.Schema.Types.Mixed, required: true },
    status: { type: String, required: true, enum: ['active', 'inactive'], default: 'inactive' },
}, {
    timestamps: true
});
exports.default = (0, mongoose_1.model)('Strategy', strategySchema);
