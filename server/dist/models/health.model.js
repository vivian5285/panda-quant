"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Health = void 0;
const mongoose_1 = require("mongoose");
const healthSchema = new mongoose_1.Schema({
    networkStatus: {
        type: mongoose_1.Schema.Types.Mixed,
        required: true
    },
    lastChecked: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});
exports.Health = (0, mongoose_1.model)('Health', healthSchema);
//# sourceMappingURL=health.model.js.map