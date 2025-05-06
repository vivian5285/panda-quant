"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const NetworkStatusSchema = new mongoose_1.Schema({
    network: { type: String, required: true },
    status: { type: String, required: true, enum: ['online', 'offline', 'error', 'checking'] },
    lastChecked: { type: Date, default: Date.now },
    blockHeight: { type: Number },
    latency: { type: Number, required: true },
    type: { type: String, required: true, enum: ['database', 'api', 'redis', 'websocket'] },
    responseTime: { type: Number, required: true },
    error: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
exports.default = (0, mongoose_1.model)('NetworkStatus', NetworkStatusSchema);
//# sourceMappingURL=NetworkStatus.js.map