"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const networkStatusSchema = new mongoose_1.Schema({
    network: { type: String, required: true },
    type: { type: String, required: true, enum: ['database', 'api', 'redis', 'websocket'] },
    status: { type: String, required: true, enum: ['online', 'offline', 'checking', 'error'] },
    lastChecked: { type: Date, required: true },
    responseTime: { type: Number, required: true },
    blockHeight: { type: Number },
    error: { type: String },
}, {
    timestamps: true
});
exports.default = (0, mongoose_1.model)('NetworkStatus', networkStatusSchema);
