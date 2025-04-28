"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logService = exports.LogService = void 0;
const mongoose_1 = require("mongoose");
const logSchema = new mongoose_1.Schema({
    level: { type: String, required: true },
    message: { type: String, required: true },
    source: { type: String, required: true },
    details: { type: mongoose_1.Schema.Types.Mixed },
    createdAt: { type: Date, default: Date.now }
});
const Log = (0, mongoose_1.model)('Log', logSchema);
class LogService {
    async createLog(level, message, source, details) {
        const log = new Log({
            level,
            message,
            source,
            details
        });
        return await log.save();
    }
}
exports.LogService = LogService;
exports.logService = new LogService();
