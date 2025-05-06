"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Monitoring = void 0;
const mongoose_1 = require("mongoose");
const monitoringSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'error'],
        default: 'active'
    },
    lastChecked: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});
exports.Monitoring = (0, mongoose_1.model)('Monitoring', monitoringSchema);
exports.default = exports.Monitoring;
//# sourceMappingURL=Monitoring.js.map