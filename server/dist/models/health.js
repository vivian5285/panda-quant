"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Health = void 0;
const mongoose_1 = require("mongoose");
const healthSchema = new mongoose_1.Schema({
    status: {
        type: String,
        required: true,
        enum: ['healthy', 'unhealthy']
    },
    lastChecked: { type: Date, required: true }
}, {
    timestamps: true
});
exports.Health = (0, mongoose_1.model)('Health', healthSchema);
exports.default = exports.Health;
//# sourceMappingURL=health.js.map